import { resolve } from "path";

export const PORT = Number.parseInt(process.env.PORT ?? "8080");
export const HOST = process.env.HOST ?? "127.0.0.1";
export const SECRET = process.env.SECRET ?? "";
export const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET ?? "";
export const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET ?? "";
export const SYNC_ON = Boolean(
  process.env.SYNC_ON && Number.parseInt(process.env.SYNC_ON)
);
export const FRONTEND_URL = process.env.FRONTEND_URL ?? "*";
export const APP_ROOT_PATH = resolve(__dirname, "../");
export const APP_ROOT_URL = `http://${HOST}:${PORT}`;
export const APP_IMAGES_LOCATION_PATH = `${APP_ROOT_PATH}/static/images`;
export const APP_IMAGES_LOCATION_FULL_URL = `${APP_ROOT_URL}/images`;
export const APP_IMAGES_LOCATION_URL = `/images`;
export const TYPEORM_CONFIG: {
  type: "postgres";
  host?: string;
  username?: string;
  password?: string;
  database?: string;
  port: number;
  entities: string[];
  migrations: string[];
  subscribers: string[];
  migrationsRun: boolean;
  synchronize: boolean;
  logging: boolean;
} = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number.parseInt(process.env.DATABASE_PORT ?? "5432"),
  entities: [__dirname + "/db/entities/*{.js,.ts}"],
  migrations: [__dirname + "/db/migrations/*{.js,.ts}"],
  subscribers: [__dirname + "/db/subscribers/*{.js,.ts}"],
  migrationsRun: false,
  synchronize: false,
  logging: true,
};
