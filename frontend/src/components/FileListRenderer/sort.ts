import {FileMetadata} from "~/types/files";

export const SORT_FUNCTIONS = {
  "a-z": (a: FileMetadata, b: FileMetadata) =>
    a.customMetadata.upload.name.localeCompare(b.customMetadata.upload.name),
  "z-a": (a: FileMetadata, b: FileMetadata) =>
    -a.customMetadata.upload.name.localeCompare(b.customMetadata.upload.name),
  newest: (a: FileMetadata, b: FileMetadata) => -(+a.uploaded - +b.uploaded),
  oldest: (a: FileMetadata, b: FileMetadata) => +a.uploaded - +b.uploaded,
};

export const SORT_OPTIONS = Object.keys(SORT_FUNCTIONS).map((x) => ({
  value: x,
}));
export type SortFns = keyof typeof SORT_FUNCTIONS;
