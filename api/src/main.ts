import { config } from "dotenv";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import initApp from "./utils/init-app";

config();

async function bootstrap() {
  const app = initApp(await NestFactory.create(AppModule));

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
