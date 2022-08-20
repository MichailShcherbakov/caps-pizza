import { AppBar, AppBarProps, Toolbar } from "@mui/material";
import Logo from "./components/logo";
import DrawerMenuButton from "./components/menu";
import styles from "./index.module.scss";

export interface AppbarProps extends AppBarProps {}

export const Appbar: React.FC<AppbarProps> = ({ className, ...props }) => {
  return (
    <AppBar
      {...props}
      position="sticky"
      className={[styles["app-bar"], className].join(" ")}
    >
      <Toolbar>
        <DrawerMenuButton />
        <Logo />
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
