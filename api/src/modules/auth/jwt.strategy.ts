import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: __JWT_ACCESS_TOKEN_SECRET__,
    });
  }

  public async validate(payload: JwtPayload): Promise<JwtPayload> {
    return { uuid: payload.uuid };
  }
}

export default JwtStrategy;
