import React from "react";
import { Button, ButtonProps } from "@mui/material";
import Modal from "~/ui/components/modal";
import CreateModifierCategoryForm from "./form";

export interface CreateModifierCategoryModalProps extends ButtonProps {}

export default function CreateModifierCategoryModal(
  props: CreateModifierCategoryModalProps
) {
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
        <CreateModifierCategoryForm
          onSubmit={onModalCloseHandler}
          onCancel={onModalCloseHandler}
        />
      </Modal>
    </>
  );
}
