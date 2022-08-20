import { IsNotEmpty, IsString } from "class-validator";

export class SignInResponse {
  access_token: string;
}

export class RefreshTokenResponse {
  access_token: string;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
