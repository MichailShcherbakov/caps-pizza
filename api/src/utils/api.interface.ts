import * as request from "supertest";
import { INestApplication } from "@nestjs/common";

export abstract class IApi {
  protected handle: request.SuperTest<request.Test>;

  constructor(app: INestApplication) {
    this.handle = request(app.getHttpServer());
  }
}

export default IApi;
