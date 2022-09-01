import React from "react";
import { Button, Stack } from "@mui/material";
import NextImage from "next/image";
import Link from "next/link";
import { StyleProps, useStyle } from "./index.style";

export interface CategoryCardProps extends StyleProps {
  name: string;
  imageURL: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = React.memo(
  ({ name, imageURL, size = "small", active }) => {
    const { classes } = useStyle({ size, active });

    return (
      <Stack component="li">
        <Link href={`#${name}`}>
          <Button
            component="a"
            variant="outlined"
            color="primary"
            className={classes.root}
          >
            <Stack className={classes.image}>
              <NextImage
                src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${imageURL}`}
                layout="fill"
                priority
              />
            </Stack>
            {name}
          </Button>
        </Link>
      </Stack>
    );
  }
);

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
