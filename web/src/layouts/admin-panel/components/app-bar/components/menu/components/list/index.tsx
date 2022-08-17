import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BackupTableOutlinedIcon from "@mui/icons-material/BackupTableOutlined";
import InsertChartOutlinedSharpIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import { useRouter } from "next/router";

export interface MenuListProps {}

export const MENU_ITEMS = [
  {
    name: "products",
    displayName: "Товары",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    name: "products/categories",
    displayName: "Категории Товара",
    icon: <CategoryOutlinedIcon />,
  },
  {
    name: "modifiers",
    displayName: "Модификаторы Товаров",
    icon: <InsertChartOutlinedSharpIcon />,
  },
  {
    name: "modifiers/categories",
    displayName: "Типы Модификаторов",
    icon: <BackupTableOutlinedIcon />,
  },
  {
    name: "discounts",
    displayName: "Учёт скидок",
    icon: <DiscountOutlinedIcon />,
  },
  {
    name: "delivery",
    displayName: "Расчёт доставки",
    icon: <LocalShippingOutlinedIcon />,
  },
];

export const MenuList: React.FC<MenuListProps> = () => {
  const router = useRouter();

  return (
    <List>
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
