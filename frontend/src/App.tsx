import "@kit/styles";
import "@kit/css-reset";
import "~/App.css";

import {Router} from "~/_router";
import {AppLoader} from "~/components/AppLoader";

import {VNode, render} from "@hydrophobefireman/ui-lib";

function App(): VNode {
  return (
    <main>
      <AppLoader>
        <Router />
      </AppLoader>
    </main>
  );
}

render(<App />, document.getElementById("app-mount"));
