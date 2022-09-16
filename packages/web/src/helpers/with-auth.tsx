import { GetServerSideProps } from "next";
import { getRunningOperationPromises } from "~/services/api.service";
import { wrapper } from "~/store";
import { setAccessToken } from "~/store/auth.reducer";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const withAuth: GetServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req, res }) => {
      const refreshTokenResponse = await fetch(
        `${publicRuntimeConfig.API_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            cookie: req.headers.cookie ?? "",
          },
          credentials: "include",
        }
      ).then(data => data);

      if (refreshTokenResponse.status !== 200)
        return {
          redirect: {
            destination: "/panel/sign-in",
            permanent: false,
          },
        };

      const setCookie = refreshTokenResponse.headers.get("set-cookie");

      if (setCookie) res.setHeader("Set-Cookie", setCookie);

      const accessToken = (await refreshTokenResponse.json()).data.access_token;

      store.dispatch(setAccessToken({ token: accessToken }));

      await Promise.all(getRunningOperationPromises());

      store.dispatch(setAccessToken({ token: null }));

      return {
        props: {},
      };
    }
);

export default withAuth;
