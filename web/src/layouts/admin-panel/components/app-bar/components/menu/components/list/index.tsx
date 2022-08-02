import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BallotIcon from "@mui/icons-material/Ballot";
import { useRouter } from "next/router";

export interface MenuListProps {}

export const MENU_ITEMS = [
  {
    name: "promotions",
    displayName: "Акции",
    icon: <DiscountIcon />,
  },
  {
    name: "products",
    displayName: "Товары",
    icon: <InventoryIcon />,
  },
  {
    name: "product-categories",
    displayName: "Категории Товара",
    icon: <CategoryIcon />,
  },
  {
    name: "modifiers",
    displayName: "Модификаторы Товаров",
    icon: <AnalyticsIcon />,
  },
  {
    name: "modifier-categories",
    displayName: "Типы Модификаторов",
    icon: <BallotIcon />,
  },
  {
    name: "discounts",
    displayName: "Учёт скидок",
    icon: <DiscountIcon />,
  },
  {
    name: "delivery",
    displayName: "Расчёт доставки",
    icon: <LocalShippingIcon />,
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
