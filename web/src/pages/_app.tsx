import "../styles/globals.scss";
import type { AppProps as NextAppProps } from "next/app";
import AppPage from "~/interfaces/app-page.interface";

export type AppProps = NextAppProps & {
  Component: AppPage;
};

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout ?? (page => page);

  return getLayout(<Component {...pageProps} />);
}
