import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

export interface MenuListProps {}

export const MENU_ITEMS = [
  {
    name: "promotions",
    displayName: "Акции",
  },
  {
    name: "products",
    displayName: "Товары",
  },
  {
    name: "categories",
    displayName: "Категории Товара",
  },
  {
    name: "discounts",
    displayName: "Учёт скидок",
  },
  {
    name: "delivery",
    displayName: "Расчёт доставки",
  },
];

export const MenuList: React.FC<MenuListProps> = () => {
  return (
    <List>
      {MENU_ITEMS.map((item) => (
        <ListItem key={item.name}>
          <ListItemButton>
            <Typography>{item.displayName}</Typography>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default MenuList;
