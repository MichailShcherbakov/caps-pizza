import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreatePaymentMutation } from "~/services/payments.service";
import PaymentForm, { PaymentFormProps, PaymentFormSubmitData } from "./form";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/components/error-catcher/modal";

export interface CreatePaymentModalProps
  extends Pick<ModalControllerProps<CreatePaymentModalProps>, "children">,
    Pick<ModalProps, "onClose"> {}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createPayment] = useCreatePaymentMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<PaymentFormProps, PaymentFormSubmitData>}
        ModalProps={{
          onClose,
          Form: PaymentForm,
          FormProps: {
            variant: "create",
            onSubmit: async value => {
              try {
                setLoading(true);

                await createPayment(value).unwrap();
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

export default CreatePaymentModal;
