import "../styles/globals.scss";
import "../utils";
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

import { Provider } from "react-redux";

function App(props: AppProps) {
  const { Component, emotionCache = clientSideEmotionCache, ...rest } = props;

  const {
    store,
    props: { pageProps },
  } = wrapper.useWrappedStore(rest);

  const getLayout = Component.getLayout ?? (page => page);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        {getLayout(<Component {...pageProps} />)}
      </CacheProvider>
    </Provider>
  );
}

App.getInitialProps = () => ({});

export default App;
