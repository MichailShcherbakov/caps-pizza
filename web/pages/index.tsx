import { Stack, ThemeProvider } from "@mui/material";
import type { NextPage } from "next";
import AppBar from "~/ui/components/app-bar";
import theme from "~/ui/theme";
import styles from "./index.module.scss";

export const Home: NextPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Stack alignItems="center" className={styles["main-layout"]}>
        <Stack className={styles["main-layout__container"]}>
          <AppBar></AppBar>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
