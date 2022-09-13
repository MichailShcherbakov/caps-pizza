import "~/env";
import "~/utils";
import { TYPEORM_CONFIG } from "~/config";
import { DataSource } from "typeorm";

export const PostgresDataSource = new DataSource({
  ...TYPEORM_CONFIG,
  entities: [__dirname + "/entities/*{.js,.ts}"],
  migrations: [__dirname + "/migrations/*{.js,.ts}"],
  subscribers: [__dirname + "/subscribers/*{.js,.ts}"],
});
