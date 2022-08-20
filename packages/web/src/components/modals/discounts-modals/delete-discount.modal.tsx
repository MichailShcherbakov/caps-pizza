import WarnDeletingNotificationModal, {
  WarnDeletingNotificationModalProps,
} from "~/components/notifications/modals/warn-deleting.notification";
import {
  Discount,
  useDeleteDiscountMutation,
} from "~/services/discounts.service";

export interface DeleteDiscountModalProps
  extends Pick<
    WarnDeletingNotificationModalProps,
    "children" | "onAccept" | "onClose"
  > {
  discount: Discount;
}

export const DeleteDiscountModal: React.FC<DeleteDiscountModalProps> = ({
  discount,
  children,
  onAccept,
  onClose,
}) => {
  const [deleteDiscount] = useDeleteDiscountMutation();

  return (
    <WarnDeletingNotificationModal
      title="Удаление скидки необратимо"
      desc="Вы точно хотите удалить скидку"
      onAccept={async () => {
        await deleteDiscount({ uuid: discount.uuid }).unwrap();
        onAccept && onAccept();
      }}
      onClose={onClose}
    >
      {children}
    </WarnDeletingNotificationModal>
  );
};

export default DeleteDiscountModal;
