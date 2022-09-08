import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import React from "react";
import { ProductCategory } from "~/services/product-categories.service";
import { ExternalSvg } from "~/ui";

export interface ProductCategoriesSelectProps {
  productCategories: ProductCategory[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
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
          value={value}
          label="Категория"
          onChange={onChange}
          color="secondary"
        >
          {Array.isArray(productCategories) &&
            productCategories.map(c => (
              <MenuItem key={c.uuid} value={c.uuid}>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    marginRight: 2,
                  }}
                >
                  <ExternalSvg
                    src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${c.image_url}`}
                    sx={{
                      width: theme => theme.spacing(3),
                      height: theme => theme.spacing(3),
                    }}
                  />
                </Stack>
                <ListItemText>{c.name}</ListItemText>
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    );
  });

ProductCategoriesSelect.displayName = "ProductCategoriesSelect";

export default ProductCategoriesSelect;
