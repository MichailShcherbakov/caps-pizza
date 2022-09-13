import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Global, Injectable } from "@nestjs/common";
import { JwtPayload } from "./auth.service";
import { JWT_ACCESS_TOKEN_SECRET } from "~/config";

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_TOKEN_SECRET,
    });
  }

  public async validate(payload: JwtPayload): Promise<JwtPayload> {
    return { uuid: payload.uuid };
  }
}

export default JwtStrategy;
