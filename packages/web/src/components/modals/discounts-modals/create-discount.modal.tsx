import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateDiscountMutation } from "~/services/discounts.service";
import DiscountForm, {
  DiscountFormProps,
  DiscountFormSubmitData,
} from "./forms";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import { useGetProductsQuery } from "~/services/products.service";
import ModalErrorCatcher from "~/components/error-catcher/modal";

export interface CreateDiscountModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose"> {}

export const CreateDiscountModal: React.FC<CreateDiscountModalProps> = ({
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createDiscount] = useCreateDiscountMutation();
  const { data: products = [] } = useGetProductsQuery();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();
  const { data: modifiers = [] } = useGetModifiersQuery();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<DiscountFormProps, DiscountFormSubmitData>}
        ModalProps={{
          onClose,
          Form: DiscountForm,
          FormProps: {
            products,
            productCategories,
            modifiers,
            onSubmit: async value => {
              try {
                setLoading(true);

                await createDiscount(value).unwrap();
              } catch (e) {
                setError(e);
              } finally {
                setLoading(false);
              }
            },
          },
        }}
      >
        {children}
      </ModalController>
    </>
  );
};

export default CreateDiscountModal;
