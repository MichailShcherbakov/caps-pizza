import { Test } from "supertest";
import IApi from "~/utils/api.interface";
import { SignInDto, SignUpDto } from "../../auth.dto";
import { REFRESH_TOKEN_COOKIE } from "../../auth.controller";
import { faker } from "@faker-js/faker";

export default class Api extends IApi {
  async getAccessToken(): Promise<string> {
    const user = {
      username: faker.datatype.uuid(),
      password: faker.datatype.uuid(),
    };

    await this.singUp(user);
    const {
      body: {
        data: { access_token },
      },
    } = await this.singIn(user);

    return access_token;
  }

  singUp(dto: SignUpDto): Test {
    return this._handle.post("/auth/sign-up").send(dto);
  }

  singIn(dto: SignInDto): Test {
    return this._handle.post("/auth/sign-in").send(dto);
  }

  refreshToken(refreshToken: string): Test {
    return this._handle
      .post("/auth/refresh-token")
      .set("Cookie", [`${REFRESH_TOKEN_COOKIE}=${refreshToken}`]);
  }
}

export class AuthApiHelper extends Api {
  protected accessToken = "";

  async init(): Promise<void> {
    this.accessToken = await super.getAccessToken();
  }
}
