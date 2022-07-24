import {
  DynamicModule,
  ForwardReference,
  INestApplication,
  Type,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken, TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { TYPEORM_CONFIG } from "~/config";
import initApp from "./init-app";

export type Module =
  | Type<unknown>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<unknown>;

export class ITestingModule {
  protected _app: INestApplication | null;
  protected _dataSource: DataSource | null;

  async init(modules: Module[] = []): Promise<void> {
    const moduleFixture = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TYPEORM_CONFIG), ...modules],
    }).compile();

    this._app = initApp(moduleFixture.createNestApplication());
    await this._app.init();

    this._dataSource = this._app.get<DataSource>(getDataSourceToken());
  }

  get app(): INestApplication {
    if (!this._app) throw new Error("The test module was not initialized");

    return this._app;
  }

  get dataSource(): DataSource {
    if (!this._dataSource)
      throw new Error("The test module was not initialized");

    return this._dataSource;
  }

  async drop(): Promise<void> {
    if (!this._app || !this._dataSource)
      throw new Error("The test module was not initialized");

    await this._app.close();

    this._app = null;
    this._dataSource = null;
  }
}
