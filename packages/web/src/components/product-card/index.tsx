import { Stack } from "@mui/material";
import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { Product } from "~/services/products.service";
import ProductImage from "./product-image";
import ProductInfo from "./product-info";
import ProductPrice from "./product-price";
import { useStyle } from "./index.style";
import { ModifierCategory } from "~/services/modifier-categories.service";

export interface ProductCardProps {
  product: Product;
  modifiers: Modifier[];
  modifierCategories: ModifierCategory[];
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, modifiers, modifierCategories }) => {
    const { classes } = useStyle();
    return (
      <Stack
        direction="column"
        component="article"
        className={classes.root}
        spacing={2}
      >
        <ProductImage productName={product.name} imageURL={product.image_url} />
        <Stack
          direction="column"
          component="main"
          className={classes.inner}
          spacing={2}
        >
          <ProductInfo product={product} />
          <ProductPrice
            product={product}
            modifiers={modifiers}
            modifierCategories={modifierCategories}
          />
        </Stack>
      </Stack>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
