import NextImage from "next/image";
import { Stack } from "@mui/material";
import React from "react";
import styles from "./index.module.scss";
import LoadingIcon from "~/assets/pizza-loading-2.svg";

export interface ProductCardImageProps {
  productName: string;
  imageURL: string;
}

export const ProductImage: React.FC<ProductCardImageProps> = ({
  productName,
  imageURL,
}) => {
  const [cover, setCover] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  return (
    <Stack
      component="picture"
      className={[
        styles["product-card__image"],
        cover ? styles["product-card__image--cover"] : "",
        loading ? styles["product-card__image--loading"] : "",
      ].join(" ")}
    >
      {loading ? <LoadingIcon /> : undefined}
      <NextImage
        src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${imageURL}`}
        alt={productName}
        layout="fill"
        onLoadingComplete={({ naturalWidth, naturalHeight }) => {
          setCover(naturalWidth !== naturalHeight);
          setLoading(false);
        }}
      />
    </Stack>
  );
};

export default ProductImage;
