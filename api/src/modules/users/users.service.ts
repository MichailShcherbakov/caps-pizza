import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import UserEntity from "~/db/entities/user.entity";

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  find(options?: FindOptionsWhere<UserEntity>): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: options,
    });
  }

  findOne(options?: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: options,
    });
  }

  async findOneOrFail(
    options?: FindOptionsWhere<UserEntity>
  ): Promise<UserEntity> {
    const user = await this.findOne(options);

    if (!user)
      throw new NotFoundException(
        `The user ${options?.uuid ?? options?.name} does not exists`
      );

    return user;
  }

  async create(
    options: Pick<UserEntity, "name" | "password_hash" | "salt">
  ): Promise<UserEntity> {
    const e = new UserEntity();
    e.name = options.name;
    e.password_hash = options.password_hash;
    e.salt = options.salt;
    return this.usersRepository.save(e);
  }
}
