import { Grid, Stack } from "@mui/material";
import React from "react";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import { ProductCategory } from "~/services/product-categories.service";
import { useGetProductsQuery } from "~/services/products.service";
import ProductCard from "../product-card";
import Title from "../title";
import { sortByTags } from "./helpers/sort-by-tags.helper";
import Section from "./section";

export function withUpperLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1, str.length);
}

export interface CategorySectionProps {
  category: ProductCategory;
}

export const CategorySection: React.FC<CategorySectionProps> = React.memo(
  ({ category }) => {
    const { data: products = [] } = useGetProductsQuery();
    const { data: modifiers = [] } = useGetModifiersQuery();
    const { data: modifierCategories = [] } = useGetModifierCategoriesQuery();
    const categoryProducts = React.useMemo(
      () => products.filter(product => product.category_uuid === category.uuid),
      [products, category.uuid]
    );

    if (!categoryProducts.length) return null;

    const [tags, tagProducts] = sortByTags(categoryProducts);

    return (
      <Section id={category.name}>
        {tags.map(tag => {
          const tagElements = tag.split(":");
          let tagName = tagElements.length === 2 ? tagElements[0] : "";
          const replace = tagName[0] === "#";

          if (replace) tagName = tagName.slice(1, tagName.length);

          const categoryName = replace
            ? `${withUpperLetter(tagName)}`
            : `${withUpperLetter(category.name)} ${tagName.toLowerCase()}`;

          return (
            <Stack key={categoryName} spacing={4}>
              <Title text={categoryName} />
              <Stack>
                <Grid container spacing={3}>
                  {tagProducts[tag].map(product => {
                    const availableModifierCategories = new Set(
                      product.modifiers.map(modifier => modifier.category_uuid)
                    );
                    const availableProductModifiers = modifiers.filter(
                      modifier =>
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
          );
        })}
      </Section>
    );
  }
);

CategorySection.displayName = "CategorySection";

export default CategorySection;
