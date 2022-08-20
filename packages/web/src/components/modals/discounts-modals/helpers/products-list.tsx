import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Product } from "~/services/products.service";

export interface ProductsListProps {
  products: Product[];
  value: Product[];
  onChange?: (checkedProducts: Product[]) => void;
}

export const ProductsList: React.FC<ProductsListProps> = React.memo(
  ({ products, value, onChange }) => {
    const checked = new Set<string>(value.map(p => p.uuid));

    const handleToggle = (p: Product) => () => {
      if (checked.has(p.uuid)) {
        checked.delete(p.uuid);
      } else {
        checked.add(p.uuid);
      }

      onChange && onChange(products.filter(p => checked.has(p.uuid)));
    };

    return (
      <List>
        {products.map(p => (
          <ListItem key={p.uuid} disablePadding>
            <ListItemButton color="neutral" onClick={handleToggle(p)} dense>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Checkbox
                  color="neutral"
                  edge="start"
                  checked={checked.has(p.uuid)}
                  tabIndex={-1}
                  disableRipple
                  size="small"
                />
                <Stack>
                  <Typography variant="body1" component="p">
                    {p.name}
                  </Typography>
                  <Typography variant="subtitle2" component="p">
                    {p.category?.name}
                  </Typography>
                </Stack>
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }
);

ProductsList.displayName = "ProductsList";

export default ProductsList;
