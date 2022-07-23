import * as express from "express";
import * as cookieParser from "cookie-parser";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import ResponseFormatInterceptor from "./response-format.interceptor";

export const initApp = (appInstance: INestApplication): INestApplication => {
  appInstance.use(cookieParser());
  appInstance.use(express.static("static"));
  appInstance.useGlobalPipes(new ValidationPipe());
  appInstance.useGlobalInterceptors(new ResponseFormatInterceptor());

  return appInstance;
};

export default initApp;
