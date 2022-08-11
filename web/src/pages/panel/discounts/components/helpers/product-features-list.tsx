import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { ProductCategory } from "~/services/product-categories.service";
import styles from "../index.module.scss";

export type ProductFeature = (Modifier | ProductCategory) & { _type: string };

export interface ProductFeaturesListProps {
  features: ProductFeature[];
  value: ProductFeature[];
  onChange?: (checkedFeatures: ProductFeature[]) => void;
}

export const ProductFeaturesList: React.FC<ProductFeaturesListProps> = ({
  features,
  value,
  onChange,
}) => {
  const checked = new Set<string>(value.map(f => f.uuid));

  const handleToggle = (f: ProductFeature) => () => {
    if (checked.has(f.uuid)) {
      checked.delete(f.uuid);
    } else {
      checked.add(f.uuid);
    }

    onChange && onChange(features.filter(m => checked.has(m.uuid)));
  };

  return (
    <List className={styles["product-features-list"]}>
      {features.map(f => (
        <ListItem key={f.uuid} disablePadding>
          <ListItemButton color="neutral" onClick={handleToggle(f)} dense>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Checkbox
                color="neutral"
                edge="start"
                checked={checked.has(f.uuid)}
                tabIndex={-1}
                disableRipple
                size="small"
              />
              <Stack>
                <Typography variant="body1" component="p">
                  {f.name}
                </Typography>
                <Typography variant="subtitle2" component="p">
                  {f._type}
                </Typography>
              </Stack>
            </Stack>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ProductFeaturesList;
