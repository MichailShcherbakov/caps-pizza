import React from "react";
import { useCookies } from "react-cookie";
import { Container, Stack } from "@mui/material";
import CookiesNotification from "../cookies-notification";
import { useStyle } from "./index.style";

const NotificationManager = () => {
  const { classes } = useStyle();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [cookie, setCookie] = useCookies(["allow-cookies"]);

  React.useEffect(() => {
    setIsOpen(cookie["allow-cookies"] === undefined);
  }, [cookie]);

  if (!isOpen) return null;

  return (
    <Stack className={classes.root}>
      <Container>
        <CookiesNotification onClose={() => setCookie("allow-cookies", 1)} />
      </Container>
    </Stack>
  );
};

export default NotificationManager;
