import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import {
  Modifier,
  useUpdateModifierMutation,
} from "~/services/modifiers.service";
import UpdateModifierForm from "./update-modifier.form";
import { APIResult } from "~/services/helpers/transform-response.helper";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface UpdateModifierModalProps extends ButtonProps {
  modifier: Modifier;
}

export const UpdateModifierModal: React.FC<UpdateModifierModalProps> = ({
  modifier,
  ...props
}) => {
  const [updateModifier, result] = useUpdateModifierMutation();
  const { data: modifierCategories } = useGetModifierCategoriesQuery();

  const { error } = result as APIResult;

  const modalController = React.useCallback(
    ({ open }) => (
      <Button
        {...props}
        variant="outlined"
        color="warning"
        size="small"
        onClick={open}
      >
        Изменить
      </Button>
    ),
    [props]
  );

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={UpdateModifierForm}
        ModalProps={{
          modifier,
          modifierCategories,
          onSubmit: value => {
            updateModifier({ ...modifier, ...value });
          },
        }}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default UpdateModifierModal;
