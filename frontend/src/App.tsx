import "@kit/css-reset";
import "@kit/styles";
import "~/App.css";

import { AppLoader } from "~/components/AppLoader";
import { Router } from "~/_router";

import { render, VNode } from "@hydrophobefireman/ui-lib";

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
