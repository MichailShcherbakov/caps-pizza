import * as bcrypt from "bcryptjs";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import UsersService from "../users/users.service";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "~/config";

export const SALT_ROUNDS = 10;

export type SignUpPayload = {
  username: string;
  password: string;
};

export type SignInPayload = SignUpPayload;

export type SignInResult = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type RefreshTokenResult = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  uuid: string;
};

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async signUp({ username, password }: SignUpPayload): Promise<void> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);

    await this.usersService.create({
      name: username,
      password_hash: passwordHash,
      salt,
    });
  }

  async signIn({ username, password }: SignInPayload): Promise<SignInResult> {
    const user = await this.usersService.findOne({ name: username });

    if (!user) throw new UnauthorizedException("The authentication fails");

    const passwordHash = await bcrypt.hash(password, user.salt);

    if (passwordHash !== user.password_hash)
      throw new UnauthorizedException("The authentication fails");

    const accessToken = this.jwtService.sign(
      { uuid: user.uuid },
      { secret: JWT_ACCESS_TOKEN_SECRET, expiresIn: "10m" }
    );

    const refreshToken = await this.generateRefreshToken(user.uuid);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenPayload): Promise<SignInResult> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: JWT_REFRESH_TOKEN_SECRET,
      });

      const user = await this.usersService.findOneOrFail({
        uuid: payload.uuid,
      });

      const newAccessToken = this.jwtService.sign(
        { uuid: user.uuid },
        { secret: JWT_ACCESS_TOKEN_SECRET, expiresIn: "10m" }
      );

      const newRefreshToken = await this.generateRefreshToken(user.uuid);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException("The refresh token is expired");
    }
  }

  async generateRefreshToken(uuid: string): Promise<string> {
    return this.jwtService.sign(
      {
        uuid,
        token: await bcrypt.hash(
          await bcrypt.genSalt(SALT_ROUNDS),
          await bcrypt.genSalt(SALT_ROUNDS)
        ),
      },
      { secret: JWT_REFRESH_TOKEN_SECRET, expiresIn: "1h" }
    );
  }
}
