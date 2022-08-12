import React from "react";
import Image from "next/image";
import { Button, Stack, Typography } from "@mui/material";
import styles from "./index.module.scss";
import { ProductCategory } from "~/store/categories.reducer";

export interface CategoryCardProps extends ProductCategory {
  active?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  imageURL,
  active,
}) => {
  const onClickHandle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    document.querySelector(`#${name}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Button
      component={"a"}
      variant="outlined"
      color="primary"
      href={`#${name}`}
      className={[
        styles["category-card"],
        active ? styles["category-card--active"] : "",
      ].join(" ")}
      onClick={onClickHandle}
    >
      <Stack className={styles["category-card__icon"]}>
        <Image
          src={imageURL}
          alt="A picture of the category"
          layout="fill"
          objectFit="cover"
        />
      </Stack>
      <Typography variant="button">{name}</Typography>
    </Button>
  );
};

export default CategoryCard;
