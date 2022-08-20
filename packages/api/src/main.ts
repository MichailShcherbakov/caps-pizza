import "~/config";
import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";
import initApp from "./utils/init-app";

async function bootstrap() {
  const app = initApp(await NestFactory.create(AppModule), {
    useCors: true,
  });

  await app.listen(__PORT__);
}

bootstrap();
