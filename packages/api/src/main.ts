import "~/env";
import "~/vars";
import "~/utils";
import { PORT } from "~/config";
import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";
import initApp from "./utils/init-app";
import * as winston from "winston";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";

async function bootstrap() {
  const app = initApp(
    await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger({
        level: "info",
        format: winston.format.json(),
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike("App", {})
            ),
          }),
          new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
          }),
          new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",
          }),
        ],
      }),
    }),
    {
      useCors: true,
    }
  );

  await app.listen(PORT);
}

bootstrap();
