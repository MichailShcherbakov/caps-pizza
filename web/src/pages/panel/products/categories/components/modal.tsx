import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { Modal } from "~/ui";
import CreateProductCategoryForm from "./form";

export interface CreateProductCategoryModalProps extends ButtonProps {}

export default function CreateProductCategoryModal(
  props: CreateProductCategoryModalProps
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
        <CreateProductCategoryForm
          onSubmit={onModalCloseHandler}
          onCancel={onModalCloseHandler}
        />
      </Modal>
    </>
  );
}
