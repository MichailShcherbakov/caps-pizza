import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import styles from "./index.module.scss";
import NextImage from "next/image";
import { useCurrentSection } from "~/common/helpers/section-provider";

export interface CategoryCardProps {
  name: string;
  imageURL: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  size?: "small" | "medium";
}

export const CategoryCard: React.FC<CategoryCardProps> = React.memo(
  ({ name, imageURL, size = "small", onClick }) => {
    const { currentActiveSectionName } = useCurrentSection();

    return (
      <Button
        component={"a"}
        variant="outlined"
        color="primary"
        href={`#${name}`}
        className={[
          styles[`category-card--${size}`],
          currentActiveSectionName === name
            ? styles[`category-card--${size}--active`]
            : "",
        ].join(" ")}
        onClick={onClick}
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
    );
  }
);

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
