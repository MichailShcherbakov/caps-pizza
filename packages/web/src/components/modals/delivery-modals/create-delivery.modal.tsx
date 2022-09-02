import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateDeliveryMutation } from "~/services/delivery.service";
import DeliveryForm, {
  DeliveryFormProps,
  DeliveryFormSubmitData,
} from "./forms";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/components/error-catcher/modal";

export interface CreateDeliveryModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose"> {}

export const CreateDeliveryModal: React.FC<CreateDeliveryModalProps> = ({
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createDelivery] = useCreateDeliveryMutation();

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
            variant: "create",
            onSubmit: async value => {
              try {
                setLoading(true);

                await createDelivery(value).unwrap();
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

export default CreateDeliveryModal;
