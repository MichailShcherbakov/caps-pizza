import * as bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import UserEntity from "~/db/entities/user.entity";
import UsersService from "~/modules/users/users.service";
import { SignUpDto } from "../auth.dto";
import { SALT_ROUNDS } from "../auth.service";
import Api from "./helpers/api.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Auth Module] ...", () => {
  let testingModule: TestingModule;
  let api: Api;
  let usersService: UsersService;
  let jwtService: JwtService;

  const REFRESH_TOKEN_REGEX = /^rf-tn=([a-zA-Z0-9_.-]+);/;

  const signUpHelper = async (): Promise<[UserEntity, string]> => {
    const dto: SignUpDto = {
      username: faker.datatype.string(),
      password: faker.datatype.string(),
    };

    await api.singUp(dto);

    return [
      await usersService.findOneOrFail({ name: dto.username }),
      dto.password,
    ];
  };

  const signInHelper = async (
    username: string,
    password: string
  ): Promise<[string, string]> => {
    const {
      header,
      body: {
        data: { access_token },
      },
    } = await api.singIn({ username, password });

    const refreshToken = REFRESH_TOKEN_REGEX.exec(header["set-cookie"])?.at(
      1
    ) as string;

    return [access_token, refreshToken];
  };

  beforeAll(async () => {
    testingModule = new TestingModule();

    await testingModule.init();

    api = new Api(testingModule.app);

    usersService = testingModule.get<UsersService>(UsersService);
    jwtService = testingModule.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await testingModule.clearDataSource();
  });

  afterAll(async () => {
    await testingModule.drop();
  });

  describe("[Post] /auth/sign-up", () => {
    it("should successfully sign up", async () => {
      const TEST_NEW_USER: SignUpDto = {
        username: faker.datatype.string(),
        password: faker.datatype.string(),
      };

      const signUpResponse = await api.singUp(TEST_NEW_USER);

      expect(signUpResponse.status).toEqual(201);
      expect(signUpResponse.body).toEqual({
        statusCode: 201,
      });

      expect(
        await usersService.findOne({ name: TEST_NEW_USER.username })
      ).not.toBeNull();
    });
  });

  describe("[Post] /auth/sign-in", () => {
    it("should successfully sign in", async () => {
      const [user, password] = await signUpHelper();

      const signInResponse = await api.singIn({
        username: user.name,
        password,
      });

      const access_token = signInResponse.body.data.access_token;

      expect(signInResponse.status).toEqual(200);
      expect(signInResponse.body).toEqual({
        statusCode: 200,
        data: {
          access_token,
        },
      });
      expect(
        REFRESH_TOKEN_REGEX.test(signInResponse.header["set-cookie"])
      ).toBeTruthy();
      expect(
        jwtService.verify(access_token, { secret: __JWT_ACCESS_TOKEN_SECRET__ })
      ).toBeTruthy();
      expect(jwtService.decode(access_token)).toHaveProperty("uuid", user.uuid);
    });

    it("should throw an error when the password is wrong", async () => {
      const [user] = await signUpHelper();

      const signInResponse = await api.singIn({
        username: user.name,
        password: faker.datatype.string(),
      });

      expect(signInResponse.status).toEqual(401);
      expect(signInResponse.body).toEqual({
        statusCode: 401,
        error: "Unauthorized",
        message: "The authentication fails",
      });
    });
  });

  describe("[Post] /auth/refresh-token", () => {
    it("should successfully refresh the token", async () => {
      const [user, password] = await signUpHelper();
      const [, refreshToken] = await signInHelper(user.name, password);

      const refreshTokenResponse = await api.refreshToken(refreshToken);

      const newRefreshToken = REFRESH_TOKEN_REGEX.exec(
        refreshTokenResponse.header["set-cookie"]
      )?.at(1);
      expect(newRefreshToken).toBeDefined();
      expect(newRefreshToken).not.toEqual(refreshToken);

      const access_token = refreshTokenResponse.body.data.access_token;
      expect(
        jwtService.verify(access_token, { secret: __JWT_ACCESS_TOKEN_SECRET__ })
      ).toBeTruthy();
      expect(jwtService.decode(access_token)).toHaveProperty("uuid", user.uuid);

      expect(refreshTokenResponse.status).toEqual(200);
      expect(refreshTokenResponse.body).toEqual({
        statusCode: 200,
        data: {
          access_token,
        },
      });
    });

    it("should throw an error when the refresh token is expired", async () => {
      const [user, password] = await signUpHelper();
      await signInHelper(user.name, password);
      const TEST_EXPIERED_REFRESH_TOKEN = jwtService.sign(
        {
          token: await bcrypt.hash(
            await bcrypt.genSalt(SALT_ROUNDS),
            await bcrypt.genSalt(SALT_ROUNDS)
          ),
        },
        { secret: __JWT_REFRESH_TOKEN_SECRET__, expiresIn: "0" }
      );

      const refreshTokenResponse = await api.refreshToken(
        TEST_EXPIERED_REFRESH_TOKEN
      );

      expect(refreshTokenResponse.status).toEqual(401);
      expect(refreshTokenResponse.body).toEqual({
        statusCode: 401,
        error: "Unauthorized",
        message: "The refresh token is expired",
      });
    });
  });
});
