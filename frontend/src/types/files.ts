interface EncryptionMetadata {
  API_VERSION: string;
  salt: string;
  ITER_COUNT: number;
  iv: string;
}
interface MediaMetadata {
  originalDimensions: number[];
  thumbnailDimensions: number[];
}

export interface PreviewEncryptionMetadata extends EncryptionMetadata {
  mediaMetadata: MediaMetadata;
  hash: string;
}

export interface CustomMetadata {
  upload: EncryptionMetadata & {
    name: string;
    unencryptedUpload: boolean;
    contentType: string;
  };
}

export interface HttpMetadata {
  contentType: string;
}

export interface PreviewMetadata {
  upload: PreviewEncryptionMetadata;
}

export interface FileMetadata {
  customMetadata: CustomMetadata;
  httpMetadata: HttpMetadata;
  uploaded: Date;
  httpEtag: string;
  etag: string;
  size: number;
  version: string;
  key: string;
  previewMetadata: PreviewMetadata;
  checksums?: any;
}

export interface FileListResponse {
  delimitedPrefixes: string[];
  cursor?: string;
  objects: FileMetadata[];
  trucated: boolean;
}

declare global {
  interface HTMLElement {
    _nodeContext?: any;
  }
}
