import {FileMetadata} from "./files";

export interface PreviewInit {
  file: FileMetadata;
  decryptionKeys: string;
  blurHash?: string;
  className?: string;
}
