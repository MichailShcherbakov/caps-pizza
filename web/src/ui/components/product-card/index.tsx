import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import ToggleButton from "../toggle-button";
import styles from "./index.module.scss";

export interface ProductCardProps {
  name: string;
  desc?: string;
  imageURL: string;
  specifics: string;
  price: number;
  cover?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  desc,
  imageURL,
  specifics,
  price,
  cover,
}) => {
  const [value, setValue] = React.useState<string>("Тонкое");

  const onChangeToggleValueHandler = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    if (!newValue) return;

    setValue(newValue);
  };

  return (
    <Stack className={styles["product-card"]}>
      <Stack
        className={[
          styles["product-card__image"],
          cover ? styles["product-card__image--cover"] : "",
        ].join(" ")}
      >
        <Image src={imageURL} alt="A product image" layout="fill" />
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
            {specifics}
          </Typography>
        </Stack>
        <Typography className={styles["product-card__desc"]}>{desc}</Typography>
        <ToggleButton
          elements={[
            { name: "Тонкое", value: "Тонкое" },
            { name: "Пышное", value: "Пышное" },
          ]}
          value={value}
          exclusive
          onChange={onChangeToggleValueHandler}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className={styles["product-card--medium__footer"]}
        >
          <Button variant="outlined">
            <Typography variant="button">Выбрать</Typography>
          </Button>
          <Typography
            variant="h4"
            component="p"
            className={styles["product-card__price"]}
          >
            {price} ₽
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
            {specifics}
          </Typography>
          <Button
            variant="contained"
            className={styles["product-card--small__price"]}
          >
            <Typography variant="button">{price} ₽</Typography>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProductCard;
