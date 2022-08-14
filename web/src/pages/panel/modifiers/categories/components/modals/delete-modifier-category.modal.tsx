import React from "react";
import WarnDeletingNotificationModal, {
  WarnDeletingNotificationModalProps,
} from "~/common/components/notifications/modals/warn-deleting.notification";
import {
  ModifierCategory,
  useDeleteModifierCategoryMutation,
} from "~/services/modifier-categories.service";

export interface DeleteModifierCategoryModalProps
  extends Pick<
    WarnDeletingNotificationModalProps,
    "children" | "onAccept" | "onClose"
  > {
  category: ModifierCategory;
}

export const DeleteModifierCategoryModal: React.FC<
  DeleteModifierCategoryModalProps
> = ({ children, category, onAccept, onClose }) => {
  const [deleteModifierCategory] = useDeleteModifierCategoryMutation();

  return (
    <WarnDeletingNotificationModal
      title="Удаление типа модификаторов необратимо"
      desc="Все прикрепленные к этому типу модификаторы будут удалены"
      onAccept={async () => {
        await deleteModifierCategory({ uuid: category.uuid }).unwrap();

        onAccept && onAccept();
      }}
      onClose={onClose}
    >
      {children}
    </WarnDeletingNotificationModal>
  );
};

export default DeleteModifierCategoryModal;
