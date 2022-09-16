import NextImage from "next/image";
import { Stack, TableCell } from "@mui/material";
import React from "react";
import LoadingIcon from "~/assets/pizza-loading-2.svg";
import { useStyle } from "./index.style";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export interface ProductCardImageProps {
  imageWidth: number;
  imageHeight: number;
  imageURL?: string;
  align?: "right" | "left";
  className?: string;
}

export const ImageColumn: React.FC<ProductCardImageProps> = ({
  imageWidth,
  imageHeight,
  imageURL,
  align,
  className,
}) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const { classes, cx } = useStyle({
    loading,
  });

  const onLoadingComplete = React.useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <TableCell align={align ?? "right"}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={align === "left" ? "flex-start" : "flex-end"}
        className={cx(classes.root, className)}
        style={{
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
        }}
      >
        {loading ? <LoadingIcon /> : undefined}
        <NextImage
          src={`${publicRuntimeConfig.IMAGES_SOURCE_URL}${imageURL}`}
          layout="fill"
          alt="data table image cell"
          onLoadingComplete={onLoadingComplete}
        />
      </Stack>
    </TableCell>
  );
};

export default ImageColumn;
