interface ProgressRequestProps {
  onProgress?(e: ProgressEvent): void;
  onComplete?(e: ProgressEvent): void;
  onError?(e: ProgressEvent<any>): void;
  method?: "GET" | "PUT" | "POST";
  signal?: AbortSignal;
}
export class ProgressRequest {
  private xhr: XMLHttpRequest;

  constructor(private url: string, options: ProgressRequestProps) {
    const {onComplete, onProgress, onError, method = "PUT", signal} = options;
    this.xhr = new XMLHttpRequest();
    this.xhr.open(method, this.url);
    this.xhr.upload.onprogress = onProgress;
    this.xhr.onload = onComplete;
    this.xhr.onerror = onError;

    if (signal) {
      signal.addEventListener("abort", () => this.abort());
    }
  }
  headers(h: Record<string, string>) {
    for (const [key, val] of Object.entries(h)) {
      this.xhr.setRequestHeader(key, val);
    }
  }
  send(body: XMLHttpRequestBodyInit) {
    this.xhr.send(body);
  }
  abort() {
    this.xhr.abort();
  }
}
