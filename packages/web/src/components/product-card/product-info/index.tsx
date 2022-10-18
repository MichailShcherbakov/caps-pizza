import { Stack, Typography } from "@mui/material";
import React from "react";
import {
  Product,
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "~/services/products.service";
import { useStyle } from "./index.style";
import { locale } from "@monorepo/common/locale";

export interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { classes } = useStyle();

  let amount = "";
  let specifics = "";

  if (product.volume) {
    if (product.volume.type === ProductVolumeTypeEnum.QUANTITY) {
      amount = `, ${product.volume.value}${locale[product.volume.type]}`;
    } else {
      specifics += `${product.volume.value}${locale[product.volume.type]}`;
    }
  }

  if (product.weight) {
    if (product.weight.type === ProductWeightTypeEnum.LITERS) {
      amount = `, ${product.weight.value}${locale[product.weight.type]}`;
    } else {
      if (specifics.length) specifics += " / ";

      specifics += `${product.weight.value}${locale[product.weight.type]}`;
    }
  }

  return (
    <Stack className={classes.root}>
      <Stack
        direction="row"
        justifyContent="space-between"
        className={classes.header}
      >
        <Typography variant="h4" component="p">
          {`${product.name}${amount}`}
        </Typography>
        <Typography variant="subtitle1" className={classes.specifics}>
          {specifics}
        </Typography>
      </Stack>
      {product.desc?.length !== 0 ? (
        <Typography>{product.desc ?? "Без описания"}</Typography>
      ) : undefined}
    </Stack>
  );
};

export default ProductInfo;
