import WarnDeletingNotificationModal, {
  WarnDeletingNotificationModalProps,
} from "~/components/notifications/modals/warn-deleting.notification";
import {
  Promotion,
  useDeletePromotionMutation,
} from "~/services/promotions.service";
import { ModalControllerProps } from "~/ui";

export interface DeletePromotionModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<WarnDeletingNotificationModalProps, "onAccept" | "onClose"> {
  promotion: Promotion;
}

export const DeletePromotionModal: React.FC<DeletePromotionModalProps> = ({
  promotion,
  children,
  onAccept,
  onClose,
}) => {
  const [deletePromotion] = useDeletePromotionMutation();

  return (
    <WarnDeletingNotificationModal
      title="Удаление акции необратимо"
      desc="Вы точно хотите удалить акцию?"
      onAccept={async () => {
        await deletePromotion({ uuid: promotion.uuid });
        onAccept && onAccept();
      }}
      onClose={onClose}
    >
      {children}
    </WarnDeletingNotificationModal>
  );
};

export default DeletePromotionModal;
