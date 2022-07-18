import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import styles from "./index.module.scss";

export interface ProductCardProps {
  name: string;
  desc: string;
  addInfo: string;
  price: string;
  iconUrl: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  desc,
  price,
  addInfo,
  iconUrl,
}) => {
  return (
    <Stack className={styles["product-card"]}>
      <Stack className={styles["product-card__image"]}>
        <Image src={iconUrl} alt="A product image" layout="fill" />
      </Stack>
      <Stack className={styles["product-card__info"]}>
        <Stack direction="row" className={styles["product-card__header"]}>
          <Typography variant="h4" className={styles["product-card__title"]}>
            {name}
          </Typography>
          <Typography
            variant="subtitle1"
            className={styles["product-card__add-info"]}
          >
            {addInfo}
          </Typography>
        </Stack>
        <Typography className={styles["product-card__desc"]}>{desc}</Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className={styles["product-card--medium__footer"]}
        >
          <Button variant="outlined">Выбрать</Button>
          <Typography
            variant="h4"
            component="p"
            className={styles["product-card__price"]}
          >
            {price}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className={styles["product-card--small__footer"]}
        >
          <Typography
            variant="subtitle1"
            className={styles["product-card--small__add-info"]}
          >
            {addInfo}
          </Typography>
          <Button
            variant="contained"
            className={styles["product-card--small__price"]}
          >
            {price}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProductCard;
