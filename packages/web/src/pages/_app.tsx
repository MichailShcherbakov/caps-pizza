import "../styles/globals.scss";
import "../utils";
import "../config";
import type { AppProps as NextAppProps } from "next/app";
import AppPage from "~/interfaces/app-page.interface";
import AbortController from "abort-controller";
import fetch, { Headers, Request, Response } from "cross-fetch";
import "external-svg-loader";

Object.assign(globalThis, {
  fetch,
  Headers,
  Request,
  Response,
  AbortController,
});

import { wrapper } from "~/store";
import createEmotionCache from "~/helpers/create-emotion-cache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import Head from "next/head";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export type AppProps = NextAppProps & {
  Component: AppPage;
  emotionCache?: EmotionCache;
};

function App(props: AppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? (page => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </CacheProvider>
  );
}

export default wrapper.withRedux(App);
