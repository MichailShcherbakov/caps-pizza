import WarnDeletingNotificationModal, {
  WarnDeletingNotificationModalProps,
} from "~/components/notifications/modals/warn-deleting.notification";
import {
  Modifier,
  useDeleteModifierMutation,
} from "~/services/modifiers.service";
import { ModalControllerProps } from "~/ui";

export interface DeleteModifierModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<WarnDeletingNotificationModalProps, "onAccept" | "onClose"> {
  modifier: Modifier;
}

export const DeleteModifierModal: React.FC<DeleteModifierModalProps> = ({
  modifier,
  children,
  onAccept,
  onClose,
}) => {
  const [deleteModifier] = useDeleteModifierMutation();

  return (
    <WarnDeletingNotificationModal
      title="Удаление модификатора необратимо"
      desc="Если этот модификатор используется по умолчанию в товаре, то его удаление лешит продукта иметь других модификаторов такого же типа"
      onAccept={async () => {
        await deleteModifier({ uuid: modifier.uuid });
        onAccept && onAccept();
      }}
      onClose={onClose}
    >
      {children}
    </WarnDeletingNotificationModal>
  );
};

export default DeleteModifierModal;
