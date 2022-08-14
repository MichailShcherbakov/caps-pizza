import "../styles/globals.scss";
import "../common/utils";
import "../config";
import type { AppProps as NextAppProps } from "next/app";
import AppPage from "~/common/interfaces/app-page.interface";

export type AppProps = NextAppProps & {
  Component: AppPage;
};

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout ?? (page => page);

  return getLayout(<Component {...pageProps} />);
}
