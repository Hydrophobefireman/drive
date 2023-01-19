import {downloadFilesSignal} from "~/signals/file-signals";

import {$Iterator} from "@hydrophobefireman/lazy";

import {FileDownloadTask} from "../tasks/file-download-task";
import {BaseManager} from "./base-manager";

interface DownloadNotification<T extends boolean = false> {
  changed: "status" | "metadata";
  actor: `${T}` extends "true" ? DownloadManager : FileDownloadTask;
  batch?: T;
}
export class DownloadManager extends BaseManager {
  private inProgress: Set<FileDownloadTask> = new Set([]);

  public getDownloads() {
    return new $Iterator(this.inProgress.values());
  }
  public get inProgressDownloads() {
    return this.getDownloads().filter((f) => f.status !== "DONE");
  }

  public addDownload(f: FileDownloadTask) {
    this.inProgress.add(f);
    f.start();
  }
  public notifyUpdate<T extends boolean = false>(
    rest: DownloadNotification<T>
  ) {
    if (this.isBatching) return;
    this.dispatch(rest);
  }
  constructor() {
    super(downloadFilesSignal);
  }
}

export const downloadManager = new DownloadManager();
