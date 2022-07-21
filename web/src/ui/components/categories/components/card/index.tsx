import Image from "next/image";
import { Button, Stack, Typography } from "@mui/material";
import styles from "./index.module.scss";
import React from "react";

export interface CategoryCardProps {
  id: string;
  iconHref: string;
  text: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  iconHref,
  text,
}) => {
  const onClickHandle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Button
      component={"a"}
      variant="outlined"
      href={`#${id}`}
      className={styles["category-card"]}
      onClick={onClickHandle}
    >
      <Stack alignItems="center">
        <Stack className={styles["category-card__icon"]}>
          <Image
            src={iconHref}
            alt="A picture of the category"
            layout="fill"
            objectFit="cover"
          />
        </Stack>
        <Typography variant="button">{text}</Typography>
      </Stack>
    </Button>
  );
};

export default CategoryCard;
