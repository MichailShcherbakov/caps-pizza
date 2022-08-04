import React from "react";
import { Button, ButtonProps } from "@mui/material";
import Modal from "~/ui/components/modal";
import CreateModifierForm from "./form";

export interface CreateModifierModalProps extends ButtonProps {}

export default function CreateModifierModal(props: CreateModifierModalProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  function onModalCloseHandler() {
    setOpen(false);
  }

  function onButtonClickHandler() {
    setOpen(true);
  }

  return (
    <>
      <Button
        {...props}
        variant="contained"
        color="secondary"
        onClick={onButtonClickHandler}
      >
        Добавить
      </Button>
      <Modal open={open} onClose={onModalCloseHandler}>
        <CreateModifierForm
          onSubmit={onModalCloseHandler}
          onCancel={onModalCloseHandler}
        />
      </Modal>
    </>
  );
}
