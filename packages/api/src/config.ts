import { resolve } from "path";
import { config } from "dotenv";
import "~/utils/number";

config();

global.__PORT__ = Number.parseInt(process.env.PORT ?? "8080");
global.__HOST__ = process.env.HOST ?? "127.0.0.1";
global.__DEV__ = process.env.NODE_ENV === "development";
global.__SECRET__ = process.env.SECRET ?? "";
global.__JWT_ACCESS_TOKEN_SECRET__ = process.env.JWT_ACCESS_TOKEN_SECRET ?? "";
global.__JWT_REFRESH_TOKEN_SECRET__ =
  process.env.JWT_REFRESH_TOKEN_SECRET ?? "";
global.__SYNC_ON__ = Boolean(process.env.SYNC_ON);
global.__FRONTEND_URL__ = process.env.FRONTEND_URL ?? "*";
global.__APP_ROOT_PATH__ = resolve(__dirname, "../");
global.__APP_ROOT_URL__ = `http://${__HOST__}:${__PORT__}`;
global.__APP_IMAGES_LOCATION_PATH__ = `${__APP_ROOT_PATH__}/static/images`;
global.__APP_IMAGES_LOCATION_FULL_URL__ = `${__APP_ROOT_URL__}/images`;
global.__APP_IMAGES_LOCATION_URL__ = `/images`;
global.__TYPEORM_CONFIG__ = {
  type: "postgres",
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port:
    process.env.TYPEORM_PORT?.length &&
    Number.parseInt(process.env.TYPEORM_PORT),
  synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
  autoLoadEntities: true,
};
