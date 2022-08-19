import NextImage from "next/image";
import { Stack } from "@mui/material";
import React from "react";
import styles from "./index.module.scss";

export interface ProductCardImageProps {
  imageURL: string;
}

export const ProductImage: React.FC<ProductCardImageProps> = ({ imageURL }) => {
  const [cover, setCover] = React.useState<boolean>(false);

  return (
    <Stack
      className={[
        styles["product-card__image"],
        cover ? styles["product-card__image--cover"] : "",
      ].join(" ")}
    >
      <NextImage
        src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${imageURL}`}
        alt="A product image"
        layout="fill"
        onLoadingComplete={({ naturalWidth, naturalHeight }) =>
          setCover(naturalWidth !== naturalHeight)
        }
        priority
      />
    </Stack>
  );
};

export default ProductImage;
