import { GetServerSideProps } from "next";
import { getRunningOperationPromises } from "~/services/api.service";
import { wrapper } from "~/stores/admin-panel";
import { setAccessToken } from "~/stores/admin-panel/auth.reducer";

export const withAuth: GetServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req, res }) => {
      const refreshTokenResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
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
