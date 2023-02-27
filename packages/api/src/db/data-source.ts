import { TYPEORM_CONFIG } from "~/config";
import "~/utils";
import { DataSource } from "typeorm";

export const dataSource = new DataSource(TYPEORM_CONFIG);
