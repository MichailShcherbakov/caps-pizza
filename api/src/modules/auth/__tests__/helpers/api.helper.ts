import { Test } from "supertest";
import IApi from "~/utils/api.interface";
import { SignInDto, SignUpDto } from "../../auth.dto";
import { REFRESH_TOKEN_COOKIE } from "../../auth.controller";

export default class Api extends IApi {
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
