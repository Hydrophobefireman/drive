import {amzHeaders} from "@/util/amz-headers";
import {signURLRoute} from "@/util/routes";
import {blobToArrayBuffer} from "@hydrophobefireman/j-utils";

import {ProgressRequest} from "./progress-uploader";

type ManagerListener = (x: {changed: string; actor: FileUploadTask}) => void;
class Manager {
  private listenerSet: Set<ManagerListener>;
  public addListener(fn: ManagerListener) {
    this.listenerSet.add(fn);
  }
  public removeListener(fn: ManagerListener) {
    this.listenerSet.delete(fn);
  }
  public notifyUpdate(args: {changed: string; actor: FileUploadTask}) {
    this.listenerSet.forEach((x) => x(args));
  }
  constructor() {
    this.listenerSet = new Set();
  }
}
export class FileUploadTask {
  public status: "PENDING" | "STARTED" | "COMPLETE" | "DELETED" | "ERROR" =
    "PENDING";
  public errorMessage: string;
  public uploadSize: number;
  public uploadedSize: number;
  private controller: AbortController;
  public manager: Manager;
  public file: File;
  public get name() {
    return this.file.name;
  }

  public get percent() {
    return (this.uploadedSize ?? 0) / this.uploadSize;
  }

  public clearError() {
    this.status = "COMPLETE";
    this.manager.notifyUpdate({changed: "status", actor: this});
  }
  public async cancel() {
    try {
      this.controller?.abort();
    } catch (_) {}

    this.status = "DELETED";
    this.manager.notifyUpdate({actor: this, changed: "status"});
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
        this.notifyStatusUpdate();
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
    this.status = "STARTED";

    this.notifyStatusUpdate();
    const response = await fetch(signURLRoute, {});
    // const {controller, result} = requestSignedURL({
    //   file: this.name,
    //   method: "PUT",
    //   user: user,
    // });
    const json = await response.json();
    const url = json.data;
    const uploader = this.buildUploader(url);

    let binary: RequestInit["body"];

    binary = await blobToArrayBuffer(this.file);
    uploader.headers({
      "content-type": this.file.type,
      ...amzHeaders(url, {}),
    });

    this.notifyStatusUpdate();

    uploader.send(binary);
  }

  constructor(file: File) {
    this.manager = new Manager();
    this.file = file;
  }
}
