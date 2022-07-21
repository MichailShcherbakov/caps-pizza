import dynamic from "next/dynamic";
import { useCookies } from "react-cookie";
import CookiesNotification from "./cookies-notification";
import styles from "../index.module.scss";

const NotificationManager = () => {
  const [cookie, setCookie] = useCookies(["allow-cookies"]);

  return (
    <>
      {!cookie["allow-cookies"] && (
        <CookiesNotification
          className={styles["main-layout__container"]}
          onClose={() => setCookie("allow-cookies", 1)}
        />
      )}
    </>
  );
};

export default NotificationManager;
