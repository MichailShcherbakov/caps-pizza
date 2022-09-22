import { Stack } from "@mui/material";
import React from "react";
import { TableCell } from "~/ui";
import ExternalImage from "~/components/external-image";

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
}) => {
  return (
    <TableCell align={align ?? "right"}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={align === "left" ? "flex-start" : "flex-end"}
      >
        <ExternalImage
          url={imageURL}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
      </Stack>
    </TableCell>
  );
};

export default ImageColumn;
