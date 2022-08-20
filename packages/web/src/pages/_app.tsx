import "../styles/globals.scss";
import "../utils";
import "../config";
import type { AppProps as NextAppProps } from "next/app";
import AppPage from "~/interfaces/app-page.interface";
import AbortController from "abort-controller";
import fetch, { Headers, Request, Response } from "cross-fetch";

Object.assign(globalThis, {
  fetch,
  Headers,
  Request,
  Response,
  AbortController,
});

import { wrapper } from "~/store";

export type AppProps = NextAppProps & {
  Component: AppPage;
};

function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout ?? (page => page);

  return getLayout(<Component {...pageProps} />);
}

export default wrapper.withRedux(App);
