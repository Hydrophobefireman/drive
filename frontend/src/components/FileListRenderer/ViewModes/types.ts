import { FileMetadata } from "~/types/files";

export interface ViewItem {
  keys: string;
  file: FileMetadata;
  selectedFiles: Set<FileMetadata>;
  handleFileClick: Function;
  i: number;
  isWideScreen: boolean;
}
