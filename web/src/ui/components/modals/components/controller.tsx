import React from "react";

export interface ModalControllerProps<T = any> {
  children: (options: { open: () => void }) => React.ReactElement | null;
  Modal: React.ElementType<T>;
  ModalProps?: Partial<T>;
}

export const ModalController: React.FC<ModalControllerProps> = React.memo(
  ({ Modal, ModalProps, children = () => null }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const onModalCloseHandler = React.useCallback(() => {
      setIsOpen(false);

      ModalProps?.onClose && ModalProps.onClose();
    }, [ModalProps]);

    const onModalSubmitHandler = React.useCallback(
      data => {
        setIsOpen(false);

        ModalProps?.onSubmit && ModalProps.onSubmit(data);
      },
      [ModalProps]
    );

    const controller = React.useMemo(
      () => children({ open: () => setIsOpen(true) }),
      [children]
    );

    return (
      <>
        {controller}
        {isOpen && (
          <Modal
            {...ModalProps}
            open={isOpen}
            onSubmit={onModalSubmitHandler}
            onClose={onModalCloseHandler}
          />
        )}
      </>
    );
  }
);

ModalController.displayName = "ModalController";

export default ModalController;
