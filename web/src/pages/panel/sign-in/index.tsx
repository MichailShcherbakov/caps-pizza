import { Stack, ThemeProvider } from "@mui/material";
import React from "react";
import AppPage from "~/common/interfaces/app-page.interface";
import { theme } from "~/ui";
import SushiMakerIllustration from "~/assets/sushi-maker.svg";
import styles from "./index.module.scss";
import SignInForm from "./components/form";
import { SignInPayload, useSignInMutation } from "~/services/auth.service";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";
import { useRouter } from "next/router";

export const SinInPage: AppPage = () => {
  const router = useRouter();
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [signIn] = useSignInMutation();

  const handleFormSubmit = async (data: SignInPayload) => {
    try {
      setLoading(true);
      await signIn(data).unwrap();
      router.push("/panel/products");
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ModalErrorCatcher error={error} />
        <Stack
          direction="row"
          alignItems="center"
          className={styles.signin__layout}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            className={styles.signin__layout_left_side}
          >
            <SushiMakerIllustration className={styles.signin__illustration} />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            className={styles.signin__layout_right_side}
          >
            <SignInForm loading={loading} onSubmit={handleFormSubmit} />
          </Stack>
        </Stack>
      </ThemeProvider>
    </>
  );
};

export default SinInPage;
