import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MENU_ITEMS } from "./items";
import { useRouter } from "next/router";
import { useStyle } from "./index.style";

export interface MenuListProps {}

export const MenuList: React.FC<MenuListProps> = () => {
  const { classes } = useStyle();
  const router = useRouter();

  return (
    <List className={classes.root}>
      {MENU_ITEMS.map(item => (
        <ListItem key={item.name}>
          <ListItemButton
            href={`/panel/${item.name}`}
            selected={router.route === `/panel/${item.name}`}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.displayName}</ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default MenuList;
