import React from "react";

export interface ModalOverviewProps<T = any> {
  Modal: React.ElementType<T>;
  ModalProps?: Partial<T>;
}

export const ModalOverview: React.FC<ModalOverviewProps> = React.memo(
  ({ Modal, ModalProps }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(true);

    return (
      <Modal
        {...ModalProps}
        open={isOpen}
        onAccept={() => {
          ModalProps?.onAccept && ModalProps?.onAccept();
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
      />
    );
  }
);

ModalOverview.displayName = "ModalOverview";

export default ModalOverview;
