import { AppBar, Toolbar } from "@mui/material";
import Logo from "./components/logo";
import DrawerMenuButton from "./components/menu";
import styles from "./index.module.scss";

export interface AppbarProps {}

export const Appbar: React.FC<AppbarProps> = () => {
  return (
    <AppBar position="sticky" className={styles["app-bar"]}>
      <Toolbar>
        <DrawerMenuButton />
        <Logo />
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
