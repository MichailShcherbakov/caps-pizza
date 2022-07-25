import * as express from "express";
import * as cookieParser from "cookie-parser";
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import ResponseFormatInterceptor from "./response-format.interceptor";
import { Reflector } from "@nestjs/core";

export const initApp = (appInstance: INestApplication): INestApplication => {
  appInstance.use(cookieParser());
  appInstance.use(express.static("static"));
  appInstance.useGlobalPipes(new ValidationPipe());
  appInstance.useGlobalInterceptors(
    new ResponseFormatInterceptor(),
    new ClassSerializerInterceptor(new Reflector())
  );

  return appInstance;
};

export default initApp;
