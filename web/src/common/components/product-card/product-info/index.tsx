import { Stack, Typography } from "@mui/material";
import React from "react";
import { Product } from "~/services/products.service";
import getSpecifics from "../helpers/getSpecifics.helper";
import styles from "./index.module.scss";

export interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const specifics = React.useMemo(() => getSpecifics(product), [product]);

  return (
    <Stack className="ui-h-full ui-gap-2">
      <Stack
        direction="row"
        justifyContent="space-between"
        className="ui-gap-3"
      >
        <Typography variant="h4" component="p">
          {product.name}
        </Typography>
        <Typography
          variant="subtitle1"
          className={styles["product-card__specifics"]}
        >
          {specifics}
        </Typography>
      </Stack>
      <Typography>{product.desc ?? "Без описания"}</Typography>
    </Stack>
  );
};

export default ProductInfo;
