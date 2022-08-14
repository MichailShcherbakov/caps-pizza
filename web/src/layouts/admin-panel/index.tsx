import { Container, Stack, StackProps, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "~/stores/admin-panel";
import { theme } from "~/ui";
import Appbar from "./components/app-bar";
import styles from "./index.module.scss";

export interface AdminPanelLayoutProps extends StackProps {}

export const AdminPanelLayout: React.FC<AdminPanelLayoutProps> = ({
  children,
}) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Stack className={styles["admin-panel-layout"]}>
          <Appbar color="secondary" />
          <Container className={styles["admin-panel-layout__container"]}>
            <Stack className={styles["admin-panel-layout__container-inner"]}>
              {children}
            </Stack>
          </Container>
        </Stack>
      </ThemeProvider>
    </Provider>
  );
};

export default AdminPanelLayout;
