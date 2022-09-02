import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BackupTableOutlinedIcon from "@mui/icons-material/BackupTableOutlined";
import InsertChartOutlinedSharpIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";

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
    name: "payments",
    displayName: "Варианты оплаты",
    icon: <PaymentOutlinedIcon />,
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

export default MENU_ITEMS;
