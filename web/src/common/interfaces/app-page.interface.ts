import { NextPage } from "next";

export type AppPage = NextPage & {
  getLayout?: (
    page: React.ReactElement | React.ReactNode
  ) => React.ReactElement;
};

export default AppPage;
