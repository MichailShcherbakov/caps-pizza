import { AppBar, AppBarProps, Stack, Toolbar } from "@mui/material";
import { useStyle } from "./index.style";
import Logo from "./components/logo";
import DrawerMenuButton from "./components/menu";

export interface AppbarProps extends AppBarProps {}

export const Appbar: React.FC<AppbarProps> = ({ className, ...props }) => {
  const { classes, cx } = useStyle();
  return (
    <AppBar
      {...props}
      position="sticky"
      className={cx(classes.root, className)}
    >
      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={2}>
          <DrawerMenuButton />
          <Logo />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
