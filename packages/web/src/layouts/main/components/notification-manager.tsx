import React from "react";
import { useCookies } from "react-cookie";
import { Container, Stack } from "@mui/material";
import CookiesNotification from "./cookies-notification";
import styles from "./index.module.scss";

const NotificationManager = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [cookie, setCookie] = useCookies(["allow-cookies"]);

  React.useEffect(() => {
    setIsOpen(cookie["allow-cookies"] === undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isOpen) return null;

  return (
    <Stack className={styles["notification-manager"]}>
      <Container>
        <CookiesNotification onClose={() => setCookie("allow-cookies", 1)} />
      </Container>
    </Stack>
  );
};

export default NotificationManager;
