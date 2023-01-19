import {dispatchSignal} from "use-signal";
import {
  fetchFilesSignal,
  fileUploadPreferenceChanged,
} from "~/signals/file-signals";
import {Queue} from "~/util/queue";

import {$Iterator, _collectors, _range} from "@hydrophobefireman/lazy";

import {FileUploadTask} from "../tasks/file-upload-task";
import {BaseManager} from "./base-manager";

const {ARRAY_COLLECTOR} = _collectors;

interface UpdateNotification<T extends boolean = false> {
  changed: "encryption" | "status" | "metadata";
  actor: `${T}` extends "true" ? UploadManager : FileUploadTask;
  batch?: T;
}
export class UploadManager extends BaseManager {
  private uploads: Set<FileUploadTask> = new Set();

  public fileUploadComplete() {
    dispatchSignal(fetchFilesSignal);
  }
  public getUploads(): $Iterator<FileUploadTask> {
    return new $Iterator(this.uploads.keys());
  }
  public addUpload(u: FileUploadTask): void {
    this.uploads.add(u);
    this.notifyUpdate({actor: u, changed: "status"});
  }

  public getPendingUploads(): $Iterator<FileUploadTask> {
    return this.getUploads().filter((upload) => upload.status === "PENDING");
  }

  public getInProgressUploads(): $Iterator<FileUploadTask> {
    return this.getUploads().filter((upload) => upload.status === "STARTED");
  }
  public get empty() {
    return this.uploads.size === 0;
  }

  public removeUpload(u: FileUploadTask): Promise<void> {
    this.uploads.delete(u);
    return u.deleteTask();
  }
  public batched_setEncryptionStatus(status: boolean): void {
    this.batch(() =>
      this.getPendingUploads().forEach((f) => f.setEncryptionStatus(status))
    );
    this.notifyUpdate({changed: "encryption", actor: this, batch: true});
  }
  public async batched_cancelPendingUplaods(): Promise<void> {
    await this.asyncBatch(() =>
      Promise.all(
        this.getPendingUploads()
          .map((p) => this.removeUpload(p))
          .collect(ARRAY_COLLECTOR)
      )
    );
    this.notifyUpdate({changed: "status", actor: this, batch: true});
  }

  public async startPendingUploads() {
    const pending = this.getPendingUploads();

    const uploadQueue = new Queue<Promise<void>>();
    const put = () => {
      const {done, value} = pending.next();
      if (!done) {
        uploadQueue.put((value as FileUploadTask).start());
      }
      return done;
    };

    new $Iterator(_range(10)).forEach(put);

    // we start sequentially
    // starting is nothing but requesting an upload token (signed url) from the worker
    // so to reduce the pressure on the worker itself,
    // we chunk the files in groups of 10
    // generating the signed URL is actually not that expensive but i'll still like doing this instead
    // of firing 100+ requests in case of large uploads
    while (true) {
      await uploadQueue.get();
      if (put()) {
        return;
      }
    }
  }

  public notifyUpdate<T extends boolean = false>(rest: UpdateNotification<T>) {
    if (this.isBatching) return;
    this.dispatch(rest);
  }
  constructor() {
    super(fileUploadPreferenceChanged);
  }
}

export const uploadManager = new UploadManager();
