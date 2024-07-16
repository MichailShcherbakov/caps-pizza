import { Grid, Stack } from "@mui/material";
import React from "react";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import { ProductCategory } from "~/services/product-categories.service";
import { useGetProductsQuery } from "~/services/products.service";
import ProductCard from "../product-card";
import Title from "../title";
import Section from "./section";

export interface CategorySectionProps {
  category: ProductCategory;
  head?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = React.memo(
  ({ category, head = false }) => {
    const { data: products = [] } = useGetProductsQuery();
    const { data: modifiers = [] } = useGetModifiersQuery();
    const { data: modifierCategories = [] } = useGetModifierCategoriesQuery();

    const categoryProducts = React.useMemo(
      () =>
        products.filter(product =>
          product.categories.find(c => c.uuid === category.uuid)
        ),
      [products, category.uuid]
    );

    if (!categoryProducts.length) return null;

    return (
      <Section
        id={head && category.parent ? category.parent.name : category.name}
      >
        <Stack key={category.name} spacing={4}>
          <Title text={category.name} />
          <Stack>
            <Grid container spacing={3}>
              {categoryProducts.map(product => {
                const availableModifierCategories = new Set(
                  product.modifiers.map(modifier => modifier.category_uuid)
                );
                const availableProductModifiers = modifiers.filter(modifier =>
                  availableModifierCategories.has(modifier.category_uuid)
                );
                return (
                  <Grid
                    key={product.uuid}
                    item
                    xl={3}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <ProductCard
                      product={product}
                      modifiers={availableProductModifiers}
                      modifierCategories={modifierCategories}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Stack>
      </Section>
    );
  }
);

CategorySection.displayName = "CategorySection";

export default CategorySection;
