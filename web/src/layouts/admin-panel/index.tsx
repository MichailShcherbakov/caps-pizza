import { Container, Stack, StackProps, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "~/stores/admin";
import theme from "~/ui/theme";
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
            {children}
          </Container>
        </Stack>
      </ThemeProvider>
    </Provider>
  );
};

export default AdminPanelLayout;
