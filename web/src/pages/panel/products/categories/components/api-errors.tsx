import React from "react";
import { APIErrorHandle } from "~/common/components/error-handler";
import { ModalOverview, NotificationModal } from "~/ui";

export const TheNameAlreadyExistsApiError = React.memo(() => {
  return (
    <APIErrorHandle
      status={400}
      message={/^The product category with '.+' name already exists$/}
    >
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Категория товаров с таким именем уже существует",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheNameAlreadyExistsApiError.displayName = "TheNameAlreadyExistsApiError";

export const TheFileIsTooLargeApiError = React.memo(() => {
  return (
    <APIErrorHandle
      status={1010}
      message={/^The image size greater then .+ kb$/}
    >
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Картинка категории не должна быть больше 200 кб",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheFileIsTooLargeApiError.displayName = "TheFileIsTooLargeApiError";
