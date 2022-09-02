import { Stack } from "@mui/material";
import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { Product } from "~/services/products.service";
import ModifierList from "./modifier-list";
import ProductImage from "./product-image";
import ProductInfo from "./product-info";
import ProductPrice from "./product-price";
import { useStyle } from "./index.style";

export interface ProductCardProps {
  product: Product;
  modifiers: Modifier[];
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, modifiers }) => {
    const { classes } = useStyle();
    const [currentModifiers, setCurrentModifiers] = React.useState<Modifier[]>(
      product.modifiers
    );

    return (
      <Stack component="article" className={classes.root}>
        <ProductImage productName={product.name} imageURL={product.image_url} />
        <Stack component="main" className={classes.inner}>
          <ProductInfo product={product} />
          <ModifierList
            modifiers={modifiers}
            currentModifiers={currentModifiers}
            onChange={setCurrentModifiers}
          />
          <ProductPrice product={product} currentModifiers={currentModifiers} />
        </Stack>
      </Stack>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
