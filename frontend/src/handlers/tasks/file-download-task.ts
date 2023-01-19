import {decrypt} from "~/crypto/decrypt";
import {FileMetadata} from "~/types/files";
import {requests} from "~/util/bridge";
import {decryptionDownloader} from "~/util/downloader";

import {DownloadManager} from "../managers/file-download-manager";
import {publicFileURL} from "../routes";

export class FileDownloadTask {
  public status: "DOWNLOADING" | "DECRYPTING" | "PENDING" | "DONE" | "ERROR" =
    "PENDING";
  public done: number;
  private total: number;
  private controller: AbortController;
  public get name() {
    return this.file?.customMetadata?.upload.name ?? "File.bin";
  }

  public clearError() {
    this.notifyStatusChange("DONE");
  }

  private notifyStatusChange(status: FileDownloadTask["status"]) {
    this.status = status;
    this.manager.notifyUpdate({actor: this, changed: "status"});
  }
  public cancel() {
    this.controller.abort();
  }
  public async start() {
    this.notifyStatusChange("DOWNLOADING");
    decryptionDownloader(this.file, this.encryptionKeys, {
      onReceivedAbortController: (controller) => {
        this.controller = controller;
      },
      onBuf: ({total, received}) => {
        this.done = received;
        this.total = total;
        this.notifyStatusChange("DOWNLOADING");
      },
      onError: () => {
        this.notifyStatusChange("ERROR");
      },
      onDecryptStart: () => {
        this.notifyStatusChange("DECRYPTING");
      },
      onResult: (blob) => {
        const url = URL.createObjectURL(blob);
        const el = document.createElement("a");
        el.href = url;
        el.download = this.name;
        el.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        this.notifyStatusChange("DONE");
      },
    });
  }
  public get progress() {
    return (this.done ?? 0) / (this.total ?? this.file?.size) ?? 1;
  }
  constructor(
    private file: FileMetadata,
    private encryptionKeys: string,
    private manager: DownloadManager
  ) {}
}
