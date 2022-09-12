import NextImage from "next/image";
import { Stack } from "@mui/material";
import React from "react";
import LoadingIcon from "~/assets/pizza-loading-2.svg";
import { useStyle } from "./index.style";

export interface ProductCardImageProps {
  productName: string;
  imageURL: string;
}

export const ProductImage: React.FC<ProductCardImageProps> = ({
  productName,
  imageURL,
}) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const { classes } = useStyle({
    loading,
  });

  const onLoadingComplete = React.useCallback(() => setLoading(false), []);

  return (
    <Stack component="picture" className={classes.root}>
      {loading ? <LoadingIcon /> : undefined}
      <NextImage
        src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${imageURL}`}
        alt={productName}
        layout="fill"
        onLoadingComplete={onLoadingComplete}
      />
    </Stack>
  );
};

export default ProductImage;
