import { Button, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import ExternalImage from "~/components/external-image";
import getSpecifics from "~/components/product-card/helpers/getSpecifics.helper";
import ModifierList from "./modifier-list";
import { Modifier } from "~/services/modifiers.service";
import { Product } from "~/services/products.service";
import { useStyle } from "./index.style";
import { ModifierCategory } from "~/services/modifier-categories.service";
import LoadingIcon from "~/assets/pizza-loading-2.svg";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export interface ProductConstructorFormSubmitData {
  chosenModifiers: Modifier[];
}

export interface ProductConstructorFormProps {
  product: Product;
  modifiers: Modifier[];
  modifierCategories: ModifierCategory[];
  onSubmit?: (data: ProductConstructorFormSubmitData) => void;
  onCancel?: () => void;
}

export const ProductConstructorForm: React.FC<ProductConstructorFormProps> = ({
  product,
  modifiers,
  modifierCategories,
  onSubmit,
  onCancel,
}) => {
  const [cover, setCover] = React.useState<boolean>(false);
  const { classes } = useStyle({
    cover,
  });

  const [chosenModifiers, setChosenModifiers] = React.useState<Modifier[]>(
    product.modifiers
  );

  const onLoadingComplete = React.useCallback(
    ({ naturalWidth, naturalHeight }) => {
      setCover(naturalWidth !== naturalHeight);
    },
    []
  );

  const price = React.useMemo(
    () =>
      chosenModifiers.reduce(
        (price, modifier) => price + modifier.price,
        product.price
      ),
    [product, chosenModifiers]
  );

  const onProductCardSelect = React.useCallback(() => {
    onSubmit && onSubmit({ chosenModifiers });
  }, [onSubmit, chosenModifiers]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      className={classes.root}
    >
      <Stack alignItems="center" className={classes.imageLayout}>
        <ExternalImage
          url={product.image_url}
          className={classes.image}
          LoadingComponent={<LoadingIcon />}
          onLoadingComplete={onLoadingComplete}
        />
      </Stack>
      <Stack
        spacing={4}
        justifyContent="space-between"
        className={classes.layout}
      >
        <Stack spacing={2} className={classes.layoutContent}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography component="p" variant="h1">
              {product.name}
            </Typography>
            <IconButton
              onClick={onCancel}
              size="medium"
              className={classes.exitBtn}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Stack>
          <Stack>
            <Typography component="p" variant="subtitle1">
              {getSpecifics(product)}
            </Typography>
          </Stack>
          <Stack>
            <Typography component="p">
              {product.desc ?? "Без описания"}
            </Typography>
          </Stack>
          <ModifierList
            modifiers={modifiers}
            modifierCategories={modifierCategories}
            chosenModifiers={chosenModifiers}
            onChange={setChosenModifiers}
          />
        </Stack>
        <Stack className={classes.btnLayout}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.btn}
            onClick={onProductCardSelect}
          >
            Добавить в корзину за {price} ₽
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProductConstructorForm;
