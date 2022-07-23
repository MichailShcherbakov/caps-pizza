import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import ResponseFormatInterceptor from "./response-format.interceptor";

export const initApp = (appInstance: INestApplication): INestApplication => {
  appInstance.use(cookieParser());
  appInstance.useGlobalPipes(new ValidationPipe());
  appInstance.useGlobalInterceptors(new ResponseFormatInterceptor());

  return appInstance;
};

export default initApp;
