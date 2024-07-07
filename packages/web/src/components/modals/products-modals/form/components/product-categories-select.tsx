import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";
import { ProductCategory } from "~/services/product-categories.service";

export interface ProductCategoriesSelectProps {
  productCategories: ProductCategory[];
  value: ProductCategory[];
  onChange: (categories: ProductCategory[]) => void;
}

export const ProductCategoriesSelect: React.FC<ProductCategoriesSelectProps> =
  React.memo(({ productCategories, value, onChange }) => {
    return (
      <FormControl size="small" fullWidth>
        <InputLabel
          id="product-category-select-label"
          color="secondary"
          required
        >
          Категория
        </InputLabel>
        <Select
          required
          id="categoryUUID"
          name="categoryUUID"
          labelId="product-category-select-label"
          multiple
          value={value.map(c => c.uuid)}
          label="Категория"
          onChange={({ target: { value }}) => {
            const categoryIds = typeof value === 'string' ? value.split(',') : value;

            const categories = categoryIds.map(categoryId => productCategories.find(c => c.uuid === categoryId)!); 

            onChange(categories);
          }}
          color="secondary"
        >
          {Array.isArray(productCategories) &&
            productCategories.map(c => (
              <MenuItem key={c.uuid} value={c.uuid}>
                {c.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    );
  });

ProductCategoriesSelect.displayName = "ProductCategoriesSelect";

export default ProductCategoriesSelect;
