import { Container, Stack, StackProps, ThemeProvider } from "@mui/material";
import theme from "~/ui/theme";
import Appbar from "./components/app-bar";
import styles from "./index.module.scss";

export interface AdminPanelLayoutProps extends StackProps {}

export const AdminPanelLayout: React.FC<AdminPanelLayoutProps> = ({
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Stack className={styles["admin-panel-layout"]}>
        <Appbar color="secondary" />
        <Container className={styles["admin-panel-layout__container"]}>
          {children}
        </Container>
      </Stack>
    </ThemeProvider>
  );
};

export default AdminPanelLayout;
