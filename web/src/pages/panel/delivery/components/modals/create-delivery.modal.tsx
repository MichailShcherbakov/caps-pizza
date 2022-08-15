import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateDeliveryMutation } from "~/services/delivery.service";
import CreateDeliveryForm, {
  CreateDeliveryFormProps,
  CreateDeliveryFormSubmitData,
} from "../forms/create-delivery.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface CreateDeliveryModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose">,
    Pick<CreateDeliveryFormProps, "onSubmit"> {}

export const CreateDeliveryModal: React.FC<CreateDeliveryModalProps> = ({
  children,
  onSubmit,
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
        Modal={FormModal}
        ModalProps={{
          onSubmit,
          onClose,
          Form: CreateDeliveryForm,
          FormProps: {
            onSubmit: async (value: CreateDeliveryFormSubmitData) => {
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
