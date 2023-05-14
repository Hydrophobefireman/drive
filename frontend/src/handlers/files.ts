import {FileListResponse} from "~/types/files";
import {requests} from "~/util/bridge";

import {batchDeleteRoute, listFilesRoute} from "./routes";

export function getFileList(u: string) {
  const {controller, headers, result} = requests.get<FileListResponse>(
    listFilesRoute(u)
  );
  return {
    controller,
    headers,
    result: result.then(({data, error}) => {
      if (error) return {data: null, error};
      const obj = data.objects.map((x) => {
        return {
          ...x,
          uploaded: new Date(x.uploaded),
          previewMetadata: {
            upload: x.previewMetadata?.upload
              ? JSON.parse(x.previewMetadata.upload as unknown as string)
              : {},
          },
          customMetadata: {
            upload: JSON.parse(x.customMetadata.upload as unknown as string),
          },
        };
      });
      data.objects = obj;
      // .concat(obj).concat(obj).concat(obj).concat(obj)
      return {data, error};
    }),
  };
}
export function deleteFiles(u: string, files: string[]) {
  return requests.postJSON(batchDeleteRoute(u), files);
}
