import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import styles from "./index.module.scss";
import NextImage from "next/image";

export interface CategoryCardProps {
  name: string;
  imageURL: string;
  active?: boolean;
  size?: "small" | "medium";
  onClick?: (name: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = React.memo(
  ({ name, imageURL, size = "small", active, onClick }) => {
    const onButtonClick = React.useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        onClick && onClick(name);
      },
      [name, onClick]
    );

    return (
      <Stack component="li">
        <Button
          component={"a"}
          variant="outlined"
          color="primary"
          href={`#${name}`}
          className={[
            styles[`category-card--${size}`],
            active ? styles[`category-card--${size}--active`] : "",
          ].join(" ")}
          onClick={onButtonClick}
        >
          <Stack className={styles[`category-card--${size}__icon`]}>
            <NextImage
              src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${imageURL}`}
              layout="fill"
              priority
            />
          </Stack>
          <Typography variant="button">{name}</Typography>
        </Button>
      </Stack>
    );
  }
);

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
