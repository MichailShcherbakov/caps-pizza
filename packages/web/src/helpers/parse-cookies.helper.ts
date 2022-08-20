export const parseCookieHelper = (cookies: string | undefined) => {
  if (!cookies) return;

  return cookies
    .split(";")
    .map(c => c.split("="))
    .reduce((obj: Record<string, string>, cookie) => {
      obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(
        cookie[1].trim()
      );
      return obj;
    }, {});
};

export default parseCookieHelper;
