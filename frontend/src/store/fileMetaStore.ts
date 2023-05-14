import { createState } from "statedrive";
import { FileListResponse } from "~/types/files";

export const fileMetaStore = createState<FileListResponse>({
  name: "file-meta",
  initialValue: null,
});
