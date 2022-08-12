import React from "react";
import { APIErrorHandle } from "~/common/components/error-handler";
import { ModalOverview, NotificationModal } from "~/ui";

export const TheNameAlreadyExistsApiError = React.memo(() => {
  return (
    <APIErrorHandle
      status={400}
      message={/^The modifier category with '.+' name already exists$/}
    >
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Тип модификаторов с таким именем уже существует",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheNameAlreadyExistsApiError.displayName = "TheNameAlreadyExistsApiError";
