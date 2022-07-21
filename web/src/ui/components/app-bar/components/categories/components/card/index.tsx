import React from "react";
import Image from "next/image";
import { Button, Stack, Typography } from "@mui/material";
import styles from "./index.module.scss";

export interface CategoryCardProps {
  id: string;
  iconHref: string;
  text: string;
  active?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  iconHref,
  text,
  active,
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
      color="primary"
      href={`#${id}`}
      className={[
        styles["category-card"],
        active ? styles["category-card--active"] : "",
      ].join(" ")}
      onClick={onClickHandle}
    >
      <Stack className={styles["category-card__icon"]}>
        <Image
          src={iconHref}
          alt="A picture of the category"
          layout="fill"
          objectFit="cover"
        />
      </Stack>
      <Typography variant="button">{text}</Typography>
    </Button>
  );
};

export default CategoryCard;
