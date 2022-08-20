import * as express from "express";
import * as cookieParser from "cookie-parser";
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import ResponseFormatInterceptor from "./response-format.interceptor";
import { Reflector } from "@nestjs/core";

export interface InitAppOptions {
  usePrefix?: boolean;
  useCors?: boolean;
}

export const initApp = (
  appInstance: INestApplication,
  { usePrefix, useCors }: InitAppOptions = { usePrefix: false, useCors: false }
): INestApplication => {
  if (useCors)
    appInstance.enableCors({
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
      origin: __FRONTEND_URL__,
    });

  if (usePrefix) appInstance.setGlobalPrefix("/v1/api");

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
