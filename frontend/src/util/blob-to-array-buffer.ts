import {blobToArrayBuffer as b2ab} from "@hydrophobefireman/j-utils";

const HAS_NATIVE_BLOB_TO_ARRAY_BUFFER =
  "arrayBuffer" in Blob.prototype &&
  typeof Blob.prototype.arrayBuffer === "function";

export const blobToArrayBuffer = HAS_NATIVE_BLOB_TO_ARRAY_BUFFER
  ? (blob: Blob) => blob.arrayBuffer()
  : b2ab;
