import { FileMetadata } from "~/types/files";

import { _util } from "@hydrophobefireman/kit";
import { useEffect, useState } from "@hydrophobefireman/ui-lib";

export function useFilteredFiles(fileList: FileMetadata[]) {
  const [filteredFiles, setFilteredFiles] = useState(() => fileList);
  const [query, setQuery] = useState("");

  useEffect(() => {
    _util.raf(() =>
      _util.raf(() =>
        setFilteredFiles(() => {
          return fileList.filter((file) =>
            file.customMetadata.upload.name
              .toLowerCase()
              .includes(query.toLowerCase())
          );
        })
      )
    );
  }, [query, fileList]);

  return {filteredFiles, query, setQuery};
}
