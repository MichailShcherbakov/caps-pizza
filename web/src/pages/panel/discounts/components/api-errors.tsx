import React from "react";
import { APIErrorHandle } from "~/common/components/error-handler";
import { ModalOverview, NotificationModal } from "~/ui";

export const TheNameAlreadyExistsApiError = React.memo(() => {
  return (
    <APIErrorHandle
      status={400}
      message={/^The discount .+ already has the .+ name$/}
    >
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Категория с таким именем уже существует",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheNameAlreadyExistsApiError.displayName = "TheNameAlreadyExistsApiError";

export const ThePercentGreaterThen100ApiError = React.memo(() => {
  return (
    <APIErrorHandle
      status={400}
      message={
        /^The discount cannot has the value greater then 100 when it has PERCENT type$/
      }
    >
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Процент скидки не может быть больше 100",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

ThePercentGreaterThen100ApiError.displayName =
  "ThePercentGreaterThen100ApiError";

export const TheProductNotFoundApiError = React.memo(() => {
  return (
    <APIErrorHandle status={400} message={/^The product .* does not exist$/}>
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Товар не найден",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheProductNotFoundApiError.displayName = "TheProductNotFoundApiError";

export const TheProductCategoryNotFoundApiError = React.memo(() => {
  return (
    <APIErrorHandle
      status={400}
      message={/^The product category .* does not exist$/}
    >
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

export const TheValue2NotProvidedApiError = React.memo(() => {
  return (
    <APIErrorHandle
      status={400}
      message={
        /^The discount has the BETWEEN condition operator, but the value2 was not provided$/
      }
    >
      <ModalOverview
        Modal={NotificationModal}
        ModalProps={{
          title: "Нарушение валидации",
          desc: "Не было указано второе значение в условии предостваления скидки",
          variant: "error",
        }}
      />
    </APIErrorHandle>
  );
});

TheValue2NotProvidedApiError.displayName = "TheValue2NotProvidedApiError";

export const TheInvalidProductScopeApiError = React.memo(() => {
  return (
    <>
      <APIErrorHandle
        status={400}
        message={
          /^The discount cannot has the products beacuse of it has the .+ scope$/
        }
      >
        <ModalOverview
          Modal={NotificationModal}
          ModalProps={{
            title: "Нарушение валидации",
            desc: `C данной областью действия скидка не может иметь товаров`,
            variant: "error",
          }}
        />
      </APIErrorHandle>
      <APIErrorHandle
        status={400}
        message={
          /^The discount cannot has the product categories beacuse of it has the .+ scope$/
        }
      >
        <ModalOverview
          Modal={NotificationModal}
          ModalProps={{
            title: "Нарушение валидации",
            desc: "C данной областью действия скидка не может иметь категорий товаров",
            variant: "error",
          }}
        />
      </APIErrorHandle>
      <APIErrorHandle
        status={400}
        message={
          /^The discount cannot has the modifiers beacuse of it has the .+ scope$/
        }
      >
        <ModalOverview
          Modal={NotificationModal}
          ModalProps={{
            title: "Нарушение валидации",
            desc: "C данной областью действия скидка не может иметь модификаторов товаров",
            variant: "error",
          }}
        />
      </APIErrorHandle>
    </>
  );
});

TheInvalidProductScopeApiError.displayName = "TheInvalidProductScopeApiError";
