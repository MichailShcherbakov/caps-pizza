import React from "react";
import { APIErrorHandle } from "~/common/components/error-handler";
import { ModalOverview, NotificationModal } from "~/ui";

export const TheProductCategoryNotFoundApiError = React.memo(() => {
  return (
    <APIErrorHandle status={400} message={/^The category .+ does not exist$/}>
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Категория товара не найдена",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheProductCategoryNotFoundApiError.displayName =
  "TheProductCategoryNotFoundApiError";

export const TheModifierNotFoundApiError = React.memo(() => {
  return (
    <APIErrorHandle status={400} message={/^The modifier .+ does not exist$/}>
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Модификатор товара не найден",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheModifierNotFoundApiError.displayName = "TheModifierNotFoundApiError";

export const TheProductHasSeveralModifiersOneCategoryApiError = React.memo(
  () => {
    return (
      <APIErrorHandle
        status={400}
        message={
          /^The product must not have several modifiers the one .+ category$/
        }
      >
        <ModalOverview
          Modal={NotificationModal}
          ModalProps={{
            title: "Нарушение валидации",
            desc: "Товар не может иметь несколько модификаторов одного типа",
            variant: "error",
          }}
        />
      </APIErrorHandle>
    );
  }
);

TheProductHasSeveralModifiersOneCategoryApiError.displayName =
  "TheProductHasSeveralModifiersOneCategoryApiError";

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
          desc: "Картинка товара не должна быть больше 200 кб",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheFileIsTooLargeApiError.displayName = "TheFileIsTooLargeApiError";
