import { DataSource } from "typeorm";
import "../config";

export const PostgresDataSource = new DataSource({
  ...__TYPEORM_CONFIG__,
  entities: [__dirname + "/entities/*{.js,.ts}"],
  migrations: [__dirname + "/migrations/*{.js,.ts}"],
  subscribers: [__dirname + "/subscribers/*{.js,.ts}"],
});
