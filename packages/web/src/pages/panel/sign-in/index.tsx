import { CssBaseline, Stack, ThemeProvider } from "@mui/material";
import React from "react";
import AppPage from "~/interfaces/app-page.interface";
import { theme } from "~/ui";
import SushiMakerIllustration from "~/assets/sushi-maker.svg";
import SignInForm from "~/components/forms/sign-in-form";
import { SignInPayload, useSignInMutation } from "~/services/auth.service";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { useRouter } from "next/router";
import makeStyles from "~/ui/theme/makesStyles";
import Head from "next/head";

export const useStyle = makeStyles()(theme => ({
  root: {
    width: "100%",
    height: "100vh",
    backgroundColor: theme.palette.secondary.light,
  },
  leftSide: {
    width: "100%",

    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  rightSide: {
    width: "100%",

    [theme.breakpoints.down("xs")]: {
      height: "100%",
      alignItems: "flex-end",
    },
  },
  illustration: {
    width: "640px",
    height: "640px",

    [theme.breakpoints.down("lg")]: {
      width: "400px",
      height: "400px",
    },
  },
}));

export const SinInPage: AppPage = () => {
  const { classes } = useStyle();
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
      <ModalErrorCatcher error={error} />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        className={classes.root}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          className={classes.leftSide}
        >
          <SushiMakerIllustration className={classes.illustration} />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          className={classes.rightSide}
        >
          <SignInForm loading={loading} onSubmit={handleFormSubmit} />
        </Stack>
      </Stack>
    </>
  );
};

SinInPage.getLayout = page => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Панель администратора - Вход</title>
      </Head>
      {page}
    </ThemeProvider>
  );
};

export default SinInPage;
