import { Stack } from "@mui/material";
import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { Product } from "~/services/products.service";
import ModifierList from "./modifier-list";
import ProductImage from "./product-image";
import ProductInfo from "./product-info";
import ProductPrice from "./product-price";
import styles from "./index.module.scss";

export interface ProductCardProps {
  product: Product;
  modifiers: Modifier[];
  onSelect?: (product: Product, currentModifiers: Modifier[]) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, modifiers, onSelect = () => {} }) => {
    const [currentModifiers, setCurrentModifiers] = React.useState<Modifier[]>(
      product.modifiers
    );

    return (
      <Stack component="article" className={styles["product-card"]}>
        <ProductImage productName={product.name} imageURL={product.image_url} />
        <Stack component="main" className="ui-w-full ui-h-full ui-gap-2">
          <ProductInfo product={product} />
          <ModifierList
            modifiers={modifiers}
            currentModifiers={currentModifiers}
            onChange={setCurrentModifiers}
          />
          <ProductPrice
            product={product}
            currentModifiers={currentModifiers}
            onSelect={onSelect}
          />
        </Stack>
      </Stack>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
