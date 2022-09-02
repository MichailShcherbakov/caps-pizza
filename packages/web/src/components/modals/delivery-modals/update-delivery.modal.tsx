import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import {
  Delivery,
  useUpdateDeliveryMutation,
} from "~/services/delivery.service";
import DeliveryForm, {
  DeliveryFormProps,
  DeliveryFormSubmitData,
} from "./forms";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/components/error-catcher/modal";

export interface UpdateDeliveryModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose"> {
  delivery: Delivery;
}

export const UpdateDeliveryModal: React.FC<UpdateDeliveryModalProps> = ({
  delivery,
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createDelivery] = useUpdateDeliveryMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<DeliveryFormProps, DeliveryFormSubmitData>}
        ModalProps={{
          onClose,
          Form: DeliveryForm,
          FormProps: {
            delivery,
            variant: "update",
            onSubmit: async value => {
              try {
                setLoading(true);

                await createDelivery({
                  ...delivery,
                  ...value,
                }).unwrap();
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

export default UpdateDeliveryModal;
