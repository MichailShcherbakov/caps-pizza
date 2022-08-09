import React from "react";
import { APIErrorHandle } from "~/common/components/error-handler";
import { ModalOverview, NotificationModal } from "~/ui";

export const TheModifierCategoryNotFoundApiError = React.memo(() => {
  return (
    <APIErrorHandle
      status={400}
      message={/^The modifier category .+ does not exist$/}
    >
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Тип модификатора не найден",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheModifierCategoryNotFoundApiError.displayName = "TheModifierCategoryNotFound";

export const TheNameAlreadyExistsApiError = React.memo(() => {
  return (
    <APIErrorHandle
      status={400}
      message={/^The modifier with .+ name in .+ category already exists$/}
    >
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Модификатор с таким именем уже существует",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheNameAlreadyExistsApiError.displayName = "TheNameAlreadyExistsApiError";

export const TheArticleNumberAlreadyExistsApiError = React.memo(() => {
  return (
    <>
      <APIErrorHandle
        status={400}
        message={/^The product .+ already has the article number$/}
      >
        <ModalOverview
          Modal={NotificationModal}
          ModalProps={{
            title: "Нарушение валидации",
            desc: "Товар с таким артиклем уже существует",
            variant: "error",
          }}
        />
      </APIErrorHandle>
      <APIErrorHandle
        status={400}
        message={/^The modifier .+ already has the article number$/}
      >
        <ModalOverview
          Modal={NotificationModal}
          ModalProps={{
            title: "Нарушение валидации",
            desc: "Модификатор с таким артиклем уже существует",
            variant: "error",
          }}
        />
      </APIErrorHandle>
    </>
  );
});

TheArticleNumberAlreadyExistsApiError.displayName =
  "TheArticleNumberAlreadyExistsApiError";
