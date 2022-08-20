import WarnDeletingNotificationModal, {
  WarnDeletingNotificationModalProps,
} from "~/components/notifications/modals/warn-deleting.notification";
import {
  ProductCategory,
  useDeleteProductCategoryMutation,
} from "~/services/product-categories.service";

export interface DeleteProductCategoryModalProps
  extends Pick<
    WarnDeletingNotificationModalProps,
    "onAccept" | "onClose" | "children"
  > {
  category: ProductCategory;
}

export const DeleteProductCategoryModal: React.FC<
  DeleteProductCategoryModalProps
> = ({ category, children, onAccept, onClose }) => {
  const [deleteProductCategory] = useDeleteProductCategoryMutation();

  return (
    <WarnDeletingNotificationModal
      title="Удаление категории товаров необратимо"
      desc="Все прикрепленные к этой категории товары будут автоматически удалены"
      onAccept={async () => {
        await deleteProductCategory({ uuid: category.uuid });
        onAccept && onAccept();
      }}
      onClose={onClose}
    >
      {children}
    </WarnDeletingNotificationModal>
  );
};

export default DeleteProductCategoryModal;
