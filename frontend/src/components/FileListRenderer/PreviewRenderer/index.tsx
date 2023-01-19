import {PreviewInit} from "~/types/preview";

import {DefaultPreviewRenderer} from "./DefaultRenderer";
import {PreviewDecrypt} from "./PreviewDecrypt";

export function PreviewRenderer(props: PreviewInit) {
  if (!props.file?.previewMetadata?.upload?.API_VERSION) {
    // No custom preview
    // do our best
    return <DefaultPreviewRenderer {...props} />;
  }
  return <PreviewDecrypt {...props} />;
}
