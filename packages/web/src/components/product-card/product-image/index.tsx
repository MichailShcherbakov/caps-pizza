import NextImage from "next/image";
import { Stack } from "@mui/material";
import React from "react";
import LoadingIcon from "~/assets/pizza-loading-2.svg";
import { useStyle } from "./index.style";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
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
  const { classes } = useStyle({
    cover,
    loading,
  });

  const onLoadingComplete = React.useCallback(
    ({ naturalWidth, naturalHeight }) => {
      setCover(naturalWidth !== naturalHeight);
      setLoading(false);
    },
    []
  );

  return (
    <Stack component="picture" className={classes.root}>
      {loading ? <LoadingIcon /> : undefined}
      <NextImage
        src={`${publicRuntimeConfig.IMAGES_SOURCE_URL}${imageURL}`}
        alt={productName}
        layout="fill"
        onLoadingComplete={onLoadingComplete}
      />
    </Stack>
  );
};

export default ProductImage;
