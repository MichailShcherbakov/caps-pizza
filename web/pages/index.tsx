import { Stack, ThemeProvider } from "@mui/material";
import type { NextPage } from "next";
import AppBar from "~/ui/components/app-bar";
import { InfoBar } from "~/ui/components/info-bar";
import theme from "~/ui/theme";
import styles from "./index.module.scss";

export const Home: NextPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Stack alignItems="center" className={styles["main-layout"]}>
        <Stack className={styles["main-layout__container"]}>
          <InfoBar />
          <AppBar />
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
