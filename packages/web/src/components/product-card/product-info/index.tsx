import { Stack, Typography } from "@mui/material";
import React from "react";
import {
  Product,
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "~/services/products.service";
import getSpecifics from "../helpers/getSpecifics.helper";
import { useStyle } from "./index.style";
import { locale } from "@monorepo/common/locale";

export interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { classes } = useStyle();
  const specifics = React.useMemo(() => getSpecifics(product), [product]);

  let amount = "";

  if (product.weight && product.weight.type === ProductWeightTypeEnum.LITERS) {
    amount = `, ${product.weight.value}${locale[product.weight.type]}`;
  }

  if (
    product.volume &&
    product.volume.type === ProductVolumeTypeEnum.QUANTITY
  ) {
    amount = `, ${product.volume.value}${locale[product.volume.type]}`;
  }

  return (
    <Stack className={classes.root}>
      <Stack direction="row" justifyContent="space-between" spacing={3}>
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
