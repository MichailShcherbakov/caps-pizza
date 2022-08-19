import { Grid } from "@mui/material";
import React from "react";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import { ProductCategory } from "~/services/product-categories.service";
import { useGetProductsQuery } from "~/services/products.service";
import ProductCard from "../product-card";
import Title from "../title";
import Section from "./section";

export interface CategorySectionProps {
  category: ProductCategory;
}

export const CategorySection: React.FC<CategorySectionProps> = React.memo(
  ({ category }) => {
    const { products } = useGetProductsQuery(undefined, {
      selectFromResult: ({ data: products = [] }) => ({
        products: products.filter(
          product => product.category_uuid === category.uuid
        ),
      }),
    });

    const { data: modifiers = [] } = useGetModifiersQuery();

    if (!products.length) return null;

    return (
      <Section id={category.name}>
        <Title text={category.name} />
        <Grid container spacing={3}>
          {products.map(product => {
            const availableModifierCategories = new Set(
              product.modifiers.map(modifier => modifier.category_uuid)
            );
            const availableProductModifiers = modifiers.filter(modifier =>
              availableModifierCategories.has(modifier.category_uuid)
            );
            return (
              <Grid key={product.uuid} item xl={3} lg={3} md={4} sm={6} xs={12}>
                <ProductCard
                  product={product}
                  modifiers={availableProductModifiers}
                />
              </Grid>
            );
          })}
        </Grid>
      </Section>
    );
  }
);

CategorySection.displayName = "CategorySection";

export default CategorySection;
