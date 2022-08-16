import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { SignInDto } from "./auth.dto";
import AuthService from "./auth.service";

export const REFRESH_TOKEN_COOKIE = "rf-tn";

@Controller("/auth")
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/sign-up")
  async signUp(@Body() dto: SignInDto): Promise<void> {
    await this.authService.signUp(dto);
  }

  @Post("/sign-in")
  async singIn(@Res() res: Response, @Body() dto: SignInDto): Promise<void> {
    const tokens = await this.authService.signIn(dto);

    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).send({
      statusCode: 200,
      data: {
        access_token: tokens.accessToken,
      },
    });
  }

  @Post("/refresh-token")
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    const tokens = await this.authService.refreshToken({
      refreshToken: req.cookies[REFRESH_TOKEN_COOKIE],
    });

    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).send({
      statusCode: 200,
      data: {
        access_token: tokens.accessToken,
      },
    });
  }
}
