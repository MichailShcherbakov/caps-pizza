import { Tab, Tabs } from "@mui/material";
import { useFormikContext } from "formik";
import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { ProductCategory } from "~/services/product-categories.service";
import { Product } from "~/services/products.service";
import { DiscountFormData } from "../../types";
import ModifierTable from "./modifier-table";
import ProductCategoryTable from "./product-category-table";
import ProductTable from "./product-table";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export interface TabsValue {
  products_uuids: string[];
  product_categories_uuids: string[];
  modifiers_uuids: string[];
}

export interface TabsProps {
  idx: number;
  products: Product[];
  productCategories: ProductCategory[];
  modifiers: Modifier[];
}

export const TabsProps: React.FC<TabsProps> = React.memo(
  ({ idx, products, productCategories, modifiers }) => {
    const [currentTab, setCurrentTab] = React.useState<number>(0);

    const { values, setFieldValue } = useFormikContext<DiscountFormData>();
    const strategy = values.strategies[idx];

    /* value={{
      products_uuids: strategy.products_uuids,
      product_categories_uuids: strategy.product_categories_uuids,
      modifiers_uuids: strategy.modifiers_uuids,
    }}
    onChange={value => {
      setFieldValue(
        `strategies[${idx}].products_uuids`,
        value.products_uuids
      );
      setFieldValue(
        `strategies[${idx}].product_categories_uuids`,
        value.product_categories_uuids
      );
      setFieldValue(
        `strategies[${idx}].modifiers_uuids`,
        value.modifiers_uuids
      );
    }} */

    const handleChange = React.useCallback(
      (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
      },
      []
    );

    const productUUIDs = React.useMemo(
      () => new Set<string>(strategy.products_uuids),
      [strategy.products_uuids]
    );
    const productCategoriesUUIDs = React.useMemo(
      () => new Set<string>(strategy.product_categories_uuids),
      [strategy.product_categories_uuids]
    );
    const modifiersUUIDs = React.useMemo(
      () => new Set<string>(strategy.modifiers_uuids),
      [strategy.modifiers_uuids]
    );

    const onProductCheckedChange = React.useCallback(
      (product: Product) => {
        if (productUUIDs.has(product.uuid)) {
          /// uncheck
          productUUIDs.delete(product.uuid);
        } else {
          /// check
          productUUIDs.add(product.uuid);
        }

        setFieldValue(
          `strategies[${idx}].products_uuids`,
          Array.from(productUUIDs)
        );
      },
      [productUUIDs, setFieldValue, idx]
    );

    const onModifierCheckedChange = React.useCallback(
      (modifier: Modifier) => {
        if (modifiersUUIDs.has(modifier.uuid)) {
          /// uncheck
          modifiersUUIDs.delete(modifier.uuid);
        } else {
          /// check
          modifiersUUIDs.add(modifier.uuid);
        }

        setFieldValue(
          `strategies[${idx}].modifiers_uuids`,
          Array.from(modifiersUUIDs)
        );
      },
      [modifiersUUIDs, setFieldValue, idx]
    );

    const onProductCategoryCheckedChange = React.useCallback(
      (productCategory: ProductCategory) => {
        if (productCategoriesUUIDs.has(productCategory.uuid)) {
          /// uncheck
          productCategoriesUUIDs.delete(productCategory.uuid);
        } else {
          /// check
          productCategoriesUUIDs.add(productCategory.uuid);
        }

        setFieldValue(
          `strategies[${idx}].product_categories_uuids`,
          Array.from(productCategoriesUUIDs)
        );
      },
      [productCategoriesUUIDs, setFieldValue, idx]
    );

    return (
      <>
        <Tabs
          value={currentTab}
          textColor="secondary"
          indicatorColor="secondary"
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Товары" />
          <Tab label="Модификаторы" />
          <Tab label="Категории товаров" />
        </Tabs>
        <TabPanel value={currentTab} index={0}>
          <ProductTable
            products={products}
            checkedProductsUuids={productUUIDs}
            onProductCheckedChange={onProductCheckedChange}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <ModifierTable
            modifiers={modifiers}
            checkedModifiersUuids={modifiersUUIDs}
            onModifierCheckedChange={onModifierCheckedChange}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <ProductCategoryTable
            categories={productCategories}
            checkedProductCategoriesUuids={productCategoriesUUIDs}
            onProductCategoryCheckedChange={onProductCategoryCheckedChange}
          />
        </TabPanel>
      </>
    );
  }
);

TabsProps.displayName = "TabsProps";

export default TabsProps;
