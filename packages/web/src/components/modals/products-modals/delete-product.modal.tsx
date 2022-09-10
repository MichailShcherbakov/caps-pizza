import React from "react";
import WarnDeletingNotificationModal, {
  WarnDeletingNotificationModalProps,
} from "~/components/notifications/modals/warn-deleting.notification";
import { Product, useDeleteProductMutation } from "~/services/products.service";

export interface DeleteProductModalProps
  extends Pick<
    WarnDeletingNotificationModalProps,
    "onAccept" | "onClose" | "children"
  > {
  product: Product;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  product,
  children,
  onAccept,
  onClose,
}) => {
  const [deleteProduct] = useDeleteProductMutation();

  return (
    <WarnDeletingNotificationModal
      title="Удаление товара необратимо"
      desc="Вы точно хотите удалить товар?"
      onAccept={async () => {
        await deleteProduct({ uuid: product.uuid });
        onAccept && onAccept();
      }}
      onClose={onClose}
    >
      {children}
    </WarnDeletingNotificationModal>
  );
};

export default DeleteProductModal;
