import React from "react";
import { APIErrorHandle } from "~/common/components/error-handler";
import OhNoNotificationModal from "~/common/components/notifications/modals/oh-no.notification";
import { ModalOverview } from "~/ui";

export const UnknownApiError = React.memo(() => {
  return (
    <APIErrorHandle status={500}>
      <ModalOverview Modal={OhNoNotificationModal} />
    </APIErrorHandle>
  );
});

UnknownApiError.displayName = "UnknownApiError";
