import Image from "next/image";
import { Button, Stack, Typography } from "@mui/material";
import styles from "./index.module.scss";
import React from "react";
import { ProductCategory } from "~/store/categories.reducer";

export interface CategoryCardProps extends ProductCategory {}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  imageURL,
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
      href={`#${name}`}
      className={styles["category-card"]}
      onClick={onClickHandle}
    >
      <Stack alignItems="center">
        <Stack className={styles["category-card__icon"]}>
          <Image
            src={imageURL}
            alt="A picture of the category"
            layout="fill"
            objectFit="cover"
          />
        </Stack>
        <Typography variant="button">{name}</Typography>
      </Stack>
    </Button>
  );
};

export default CategoryCard;