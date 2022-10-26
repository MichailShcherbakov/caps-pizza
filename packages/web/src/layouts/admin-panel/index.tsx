import {
  Container,
  CssBaseline,
  Stack,
  StackProps,
  ThemeProvider,
} from "@mui/material";
import { theme } from "~/ui";
import Appbar from "./components/app-bar";
import { useStyle } from "./index.style";

export interface AdminPanelLayoutProps extends StackProps {}

export const AdminPanelLayout: React.FC<AdminPanelLayoutProps> = ({
  children,
}) => {
  const { classes } = useStyle();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack className={classes.root}>
        <Appbar />
        <Container className={classes.container}>
          <Stack className={classes.inner} spacing={2}>
            {children}
          </Stack>
        </Container>
      </Stack>
    </ThemeProvider>
  );
};

export default AdminPanelLayout;
