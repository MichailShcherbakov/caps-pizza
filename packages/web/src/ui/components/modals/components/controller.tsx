import React from "react";

export interface ModalComponentProps {
  onClose?: () => void;
}

export type ModalComponent<T> = React.JSXElementConstructor<T>;

export type ModalControllerHandle = (options: {
  open: () => void;
}) => React.ReactElement | null;

export interface ModalControllerProps<T = unknown> {
  children: ModalControllerHandle;
  Modal: ModalComponent<T>;
  ModalProps: Omit<T, "open">;
}

export function ModalController<T extends ModalComponentProps>({
  Modal,
  ModalProps,
  children = () => null,
}: ModalControllerProps<T>) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const onModalCloseHandler = React.useCallback(() => {
    setIsOpen(false);

    ModalProps?.onClose && ModalProps.onClose();
  }, [ModalProps]);

  const controller = React.useMemo(
    () => children({ open: () => setIsOpen(true) }),
    [children]
  );

  return (
    <>
      {controller}
      <Modal
        {...(ModalProps as T)}
        open={isOpen}
        onClose={onModalCloseHandler}
      />
    </>
  );
}

export default ModalController;
