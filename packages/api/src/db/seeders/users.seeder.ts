import { faker } from "@faker-js/faker";
import { QueryRunner } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import UserEntity from "../entities/user.entity";

export class UsersFactory extends IFactory<UserEntity> {
  create(options?: Partial<UserEntity>): UserEntity {
    const e = new UserEntity();
    e.name = options?.name ?? faker.datatype.uuid();
    e.password_hash = options?.password_hash ?? faker.datatype.uuid();
    e.salt = options?.salt ?? faker.datatype.uuid();
    return e;
  }
}

export default class UsersSeeder extends ISeeder<UserEntity> {
  constructor(q: QueryRunner) {
    super(q, new UsersFactory());
  }
}
