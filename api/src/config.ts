import { resolve } from "path";
import { config } from "dotenv";
import { TypeOrmModule } from "@nestjs/typeorm";

config();

export const APP_ROOT_PATH = resolve(__dirname, "../");
export const APP_ROOT_URL = process.env.URL;
export const APP_IMAGES_LOCATION_PATH = `${APP_ROOT_PATH}/static/images`;
export const APP_IMAGES_LOCATION_FULL_URL = `${APP_ROOT_URL}/images`;
export const APP_IMAGES_LOCATION_URL = `/images`;
export const TYPEORM_CONFIG: TypeOrmModule = {
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