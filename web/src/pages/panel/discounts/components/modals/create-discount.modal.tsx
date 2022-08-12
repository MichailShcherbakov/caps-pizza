import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import { useCreateDiscountMutation } from "~/services/discounts.service";
import ErrorHandler from "~/common/components/error-handler";
import CreateDiscountForm from "./create-discount.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { UnknownApiError } from "~/common/components/error-handler/api-errors";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import { useGetProductsQuery } from "~/services/products.service";
import {
  TheNameAlreadyExistsApiError,
  ThePercentGreaterThen100ApiError,
  TheProductNotFoundApiError,
  TheProductCategoryNotFoundApiError,
  TheModifierNotFoundApiError,
  TheValue2NotProvidedApiError,
} from "../api-errors";

export interface CreateDiscountModalProps extends ButtonProps {}

export const CreateDiscountModal: React.FC<CreateDiscountModalProps> = ({
  ...props
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [createDiscount] = useCreateDiscountMutation();
  const { data: products } = useGetProductsQuery();
  const { data: productCategories } = useGetProductCategoriesQuery();
  const { data: modifiers } = useGetModifiersQuery();

  const modalController = React.useCallback(
    ({ open }) => (
      <Button {...props} variant="contained" color="secondary" onClick={open}>
        Добавить
      </Button>
    ),
    [props]
  );

  const createDiscountFormProps = React.useMemo(
    () => ({
      products,
      productCategories,
      modifiers,
      onSubmit: async value => {
        try {
          await createDiscount(value).unwrap();
        } catch (e) {
          setError(e);
        }
      },
    }),
    [products, productCategories, modifiers, createDiscount]
  );

  return (
    <>
      <ErrorHandler error={error}>
        <TheNameAlreadyExistsApiError />
        <ThePercentGreaterThen100ApiError />
        <TheProductNotFoundApiError />
        <TheProductCategoryNotFoundApiError />
        <TheModifierNotFoundApiError />
        <TheValue2NotProvidedApiError />
        <UnknownApiError />
      </ErrorHandler>
      <ModalController
        Modal={CreateDiscountForm}
        ModalProps={createDiscountFormProps}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default CreateDiscountModal;
