import {css} from "catom";
import {useFileList} from "~/context/file-list";
import {deleteFiles} from "~/handlers/files";
import {downloadManager} from "~/handlers/managers/file-download-manager";
import {FileDownloadTask} from "~/handlers/tasks/file-download-task";
import {useLocalState} from "~/hooks/use-local-state";
import {useFetchFileSignal} from "~/signals/file-signals";
import {useAccountKeys} from "~/store/account-key-store";
import {FileMetadata} from "~/types/files";
import {useAuthState} from "~/util/bridge";

import {SpinnerIcon} from "@hydrophobefireman/kit-icons";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {TextButton} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {useMedia} from "@hydrophobefireman/kit/hooks";
import {Input} from "@hydrophobefireman/kit/input";
import {Modal} from "@hydrophobefireman/kit/modal";
import {Select} from "@hydrophobefireman/kit/select";
import {$Iterator, _collectors} from "@hydrophobefireman/lazy";
import {
  Renderable,
  useMemo,
  useReducer,
  useState,
} from "@hydrophobefireman/ui-lib";

import {FileViewer} from "../FileViewer";
import {Paginate} from "../Paginate/Paginate";
import {GridItem} from "./ViewModes/GridItem";
import {ListItem} from "./ViewModes/ListItem";
import {
  buttonWrapperClass,
  fileRenderGrid,
  fileSelectedActionBox,
} from "./file-renderer.style";
import {SORT_FUNCTIONS, SORT_OPTIONS, SortFns} from "./sort";
import {useFileSelection} from "./use-file-selections";
import {useFilteredFiles} from "./use-filtered-files";

const {ARRAY_COLLECTOR} = _collectors;
export function FileListRenderer() {
  const {fileList, fetchFiles} = useFileList();
  useFetchFileSignal(() => fetchFiles());
  const {filteredFiles, query, setQuery} = useFilteredFiles(fileList);
  const [_sort, setValue] = useLocalState<string | number>(
    "config::sort",
    "a-z"
  );
  const [displayMode, setDisplayMode] = useLocalState<"list" | "grid">(
    "config::display-mode",
    "grid"
  );
  const sort: SortFns = _sort as any;
  return (
    <div class={css({maxWidth: "1200px", margin: "auto"})}>
      <Box horizontal="center" class={css({marginTop: "2rem"})}>
        <Input
          variant="material"
          value={query}
          setValue={setQuery}
          label="search"
        />
      </Box>
      <Box>
        <Box horizontal="right" class={css({width: "95%"})}>
          <Select
            buttonClass={css({width: "7rem"})}
            dropdownClass={css({textAlign: "center"})}
            value={displayMode}
            setValue={setDisplayMode as any}
            label="Sort"
            options={[{value: "grid"}, {value: "list"}]}
          />

          <Select
            buttonClass={css({width: "7rem"})}
            dropdownClass={css({textAlign: "center"})}
            value={sort}
            setValue={setValue}
            label="Sort"
            options={SORT_OPTIONS}
          />
        </Box>
        <FielList files={filteredFiles} sort={sort} displayMode={displayMode} />
      </Box>
    </div>
  );
}

function FielList({
  files,
  sort,
  displayMode,
}: {
  files: FileMetadata[];
  sort: SortFns;
  displayMode: "list" | "grid";
}) {
  const sortedFiles = useMemo(
    () => files.sort(SORT_FUNCTIONS[sort]),
    [files, sort]
  );
  const [loading, setLoading] = useState(false);
  const {fetchFiles} = useFileList();

  const [openFileState, setState] = useReducer(
    (curr, newVal: any) => {
      return {...curr, ...newVal};
    },
    {isOpen: false, currentIndex: -1}
  );
  function openFile(f: FileMetadata) {
    setState({isOpen: true, currentIndex: sortedFiles.indexOf(f)});
  }

  const {handleFileClick, selectedFiles, gridRef, clearSelectedFiles} =
    useFileSelection(sortedFiles, openFile);
  const [user] = useAuthState();
  const [keys] = useAccountKeys();
  function handleDownload() {
    new $Iterator(selectedFiles.values())
      .map((f) => new FileDownloadTask(f, keys, downloadManager))
      .forEach((f) => downloadManager.addDownload(f));
    //  we start downloading now let the user do whatever else they want
    // except delete the file
    // downloadManager ///

    clearSelectedFiles();
  }

  const {persist} = useAlerts();
  const [isDeleting, setDeleting] = useState(false);
  async function handleDelete(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    if (loading) return;
    setLoading(true);
    const files = new $Iterator(selectedFiles.values());
    const {result} = deleteFiles(
      user.user,
      files.map((f) => f.key).collect(ARRAY_COLLECTOR)
    );
    const {error} = await result;
    if (error) {
      setLoading(false);
      persist({
        content: error,
        type: "error",
        onActionClick: () => handleDelete(e),
      });
      return;
    }
    await fetchFiles(true);
    setDeleting(false);
    clearSelectedFiles();
    setLoading(false);
  }
  const isWideScreen = useMedia.useMinWidth(600);
  const closeModal = () => setState({isOpen: false, currentIndex: -1});
  return (
    <div class={css({width: "100%", marginTop: "2rem"})}>
      {openFileState.isOpen && (
        <Modal
          onEscape={closeModal}
          onClickOutside={closeModal}
          active
          class={css({
            pseudo: {
              ".kit-modal": {width: "80vw", maxWidth: "900px", height: "90vh"},
            },
          } as any)}
        >
          <FileViewer
            close={closeModal}
            file={files[openFileState.currentIndex]}
            next={
              openFileState.currentIndex < files.length - 1 &&
              (() => setState({currentIndex: openFileState.currentIndex + 1}))
            }
            previous={
              openFileState.currentIndex > 0 &&
              (() => setState({currentIndex: openFileState.currentIndex - 1}))
            }
          />
        </Modal>
      )}
      <Modal active={isDeleting}>
        <Modal.Body>
          <div
            class={css({
              width: "100%",
              wordBreak: "break-word",
            })}
          >
            are you sure you want to delete {selectedFiles.size}{" "}
            {selectedFiles.size === 1 ? "file" : "files"}?
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Modal.Action onClick={handleDelete}>
            <span class={css({textTransform: "lowercase"})}>
              {loading ? <SpinnerIcon /> : "yes"}
            </span>
          </Modal.Action>
          <Modal.Action onClick={() => setDeleting(false)}>
            <span class={css({textTransform: "lowercase"})}>cancel</span>
          </Modal.Action>
        </Modal.Actions>
      </Modal>
      <Box
        row
        horizontal="right"
        vertical="center"
        class={fileSelectedActionBox(selectedFiles?.size > 0)}
      >
        <TextButton
          disabled={loading}
          mode="success"
          variant="shadow"
          onClick={handleDownload}
        >
          download
        </TextButton>
        <TextButton
          disabled={loading}
          mode="error"
          variant="shadow"
          onClick={() => setDeleting(true)}
        >
          delete
        </TextButton>
      </Box>
      <div ref={gridRef} class={css({width: "100%"})}>
        <Paginate
          atOnce={50}
          buttonWrapperClass={buttonWrapperClass}
          dualButtons
          items={sortedFiles}
          listBoxClass={
            displayMode === "grid"
              ? fileRenderGrid
              : css({display: "flex", flexDirection: "column", gap: "1rem"})
          }
          render={
            displayMode === "grid"
              ? createGridRenderer(
                  selectedFiles,
                  handleFileClick,
                  keys,
                  isWideScreen
                )
              : createListRenderer(
                  selectedFiles,
                  handleFileClick,
                  keys,
                  isWideScreen
                )
          }
        />
      </div>
    </div>
  );
}

interface CreatePaginationRenderer {
  (
    selectedFiles: Set<FileMetadata>,
    handleFileClick: Function,
    keys: string,
    isWideScreen: boolean
  ): (item: FileMetadata, i: number) => Renderable;
}

const createListRenderer: CreatePaginationRenderer = function (
  selectedFiles,
  handleFileClick,
  keys,
  isWideScreen
) {
  return (f, i) => (
    <ListItem
      file={f}
      handleFileClick={handleFileClick}
      isWideScreen={isWideScreen}
      i={i}
      keys={keys}
      selectedFiles={selectedFiles}
    />
  );
};

const createGridRenderer: CreatePaginationRenderer = function (
  selectedFiles,
  handleFileClick,
  keys,
  isWideScreen
) {
  return (f, i) => (
    <GridItem
      file={f}
      handleFileClick={handleFileClick}
      isWideScreen={isWideScreen}
      i={i}
      keys={keys}
      selectedFiles={selectedFiles}
    />
  );
};
