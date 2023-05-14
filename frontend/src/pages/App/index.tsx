import {FileListRenderer} from "~/components/FileListRenderer";
import {Nav} from "~/components/Nav";
import {ProgressInfo} from "~/components/ProgressInfo";
import {SafeLayout} from "~/components/SafeLayout";
import {Uploader} from "~/components/Uploader";

export default function App() {
  return (
    <SafeLayout>
      <Nav />
      <Uploader />
      <FileListRenderer />
      <ProgressInfo />
    </SafeLayout>
  );
}
