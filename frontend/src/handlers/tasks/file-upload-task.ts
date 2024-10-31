import {encrypt} from "~/crypto/encrypt";
import {amzHeaders} from "~/util/amz-headers";
import {blobToArrayBuffer} from "~/util/blob-to-array-buffer";
import {client} from "~/util/bridge";

import {deleteFiles} from "../files";
import {UploadManager, uploadManager} from "../managers/file-upload-manager";
import {
  GeneratedPreviewResult,
  previewGenerator,
  uploadPreview,
} from "../preview-uploader";
import {ProgressRequest} from "../progress-uploader";
import {requestSignedURL} from "../r2";

export class FileUploadTask {
  public shouldEncrypt: boolean = true;
  public status: "PENDING" | "STARTED" | "COMPLETE" | "DELETED" | "ERROR" =
    "PENDING";
  public progressDetail: "ENCRYPTING" | "UPLOADING_PREVIEW" | "UPLOADING";
  public errorMessage: string;
  public uploadSize: number;
  public uploadedSize: number;
  private controller: AbortController;
  private previewController: AbortController;
  private _key: string;
  public modifiedName: string;
  public get name() {
    return this.modifiedName || this.file.name;
  }

  public get percent() {
    return (this.uploadedSize ?? 0) / this.uploadSize;
  }
  public setName(v: string) {
    this.modifiedName = v;
    this.manager.notifyUpdate({changed: "metadata", actor: this});
  }
  private needsPreviews() {
    const {type} = this.file;
    return type.includes("image") || type.includes("video");
  }

  public setEncryptionStatus(status: boolean) {
    this.shouldEncrypt = status;
    this.manager.notifyUpdate({actor: this, changed: "encryption"});
  }
  public clearError() {
    this.status = "COMPLETE";
    this.manager.notifyUpdate({changed: "status", actor: this});
  }
  public async cancel() {
    try {
      this.controller?.abort();
      this.previewController?.abort();
    } catch (_) {}
    if (this.status === "STARTED") {
      deleteFiles(this.userName, [this._key]);
    }
    this.status = "DELETED";
    this.manager.notifyUpdate({actor: this, changed: "status"});
  }
  public async deleteTask() {
    this.status = "DELETED";
    await this.cancel();
    this.manager.notifyUpdate({actor: this, changed: "status"});
  }

  private async handlePreview(
    previewResult: GeneratedPreviewResult,
    previewUploadURL: string,
  ): Promise<boolean> {
    const {controller, getResult} = await uploadPreview({
      previewResult,
      previewUploadURL,
    });
    if (!getResult) return false;
    this.previewController = controller;
    const result = await getResult();
    return result.ok;
  }

  private async _encrypt() {
    return encrypt(await blobToArrayBuffer(this.file), this.encryptionKeys);
  }
  private notifyStatusUpdate() {
    this.manager.notifyUpdate({changed: "status", actor: this});
  }
  private buildUploader(url: string) {
    const controller = new AbortController();
    this.controller = controller;
    return new ProgressRequest(url, {
      method: "PUT",
      signal: controller.signal,
      onComplete: () => {
        this.status = "COMPLETE";
        this.manager.fileUploadComplete();
      },
      onError: () => {
        this.status = "ERROR";
        this.errorMessage = "Upload failed";
        this.notifyStatusUpdate();
      },
      onProgress: (e) => {
        this.uploadedSize = e.loaded;
        this.uploadSize = e.total;
        this.notifyStatusUpdate();
      },
    });
  }
  public async start() {
    const user = client.getCurrentAuthenticationScope().auth?.user;
    if (!user) {
      this.errorMessage = "Not authenticated";
      this.status = "ERROR";
      this.notifyStatusUpdate();
      return;
    }

    this.status = "STARTED";
    const needs_preview = this.needsPreviews();

    const previewGenerationResults = needs_preview
      ? await previewGenerator(this.file, this.encryptionKeys)
      : null;

    let binary: RequestInit["body"];
    let uploadMetadata: object;
    if (this.shouldEncrypt) {
      this.progressDetail = "ENCRYPTING";
      this.notifyStatusUpdate();
      const {encryptedBuf, meta} = await this._encrypt();
      binary = encryptedBuf;
      uploadMetadata = {
        ...meta,
        unencryptedUpload: false,
        name: this.name,
        contentType: this.file.type,
      };
    } else {
      binary = this.file;
      uploadMetadata = {
        unencryptedUpload: true,
        name: this.name,
        contentType: this.file.type,
      };
    }

    const {controller, result} = requestSignedURL({
      file: this.name,
      method: "PUT",
      user: user,
      data: {
        previewMetadata: previewGenerationResults?.[1],
        uploadMetadata,
      },
    });

    this.controller = controller;
    const resp = await result;
    if (resp.error) {
      this.status = "ERROR";
      this.notifyStatusUpdate();
      this.errorMessage = resp.error;
      return;
    }

    const {preview: previewUploadURL, url, key} = resp.data
    this._key = key;
    const uploader = this.buildUploader(url);
    if (needs_preview) {
      this.progressDetail = "UPLOADING_PREVIEW";
      this.notifyStatusUpdate();
      const hasPreview = await this.handlePreview(
        previewGenerationResults,
        previewUploadURL,
      );
      if (!hasPreview) console.warn("Failed preview upload for ", this);
    }

    if (this.shouldEncrypt) {
      uploader.headers({
        "content-type": "application/octet-stream",
        ...amzHeaders(url, uploadMetadata),
      });
    } else {
      uploader.headers({
        "content-type": this.file.type,
        ...amzHeaders(url, uploadMetadata),
      });
    }

    this.progressDetail = "UPLOADING";
    this.notifyStatusUpdate();

    uploader.send(binary);
  }

  constructor(
    public file: File,
    private encryptionKeys: string,
    private userName: string,
    private manager: UploadManager = uploadManager,
  ) {}
}
