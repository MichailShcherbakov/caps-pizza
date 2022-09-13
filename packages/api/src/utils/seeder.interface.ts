import { QueryRunner } from "typeorm";

export abstract class IFactory<T> {
  abstract create(options?: Partial<T>): T;
}

export abstract class ISeeder<TEntity> {
  constructor(
    protected _queryRunner: QueryRunner,
    protected _factory: IFactory<TEntity>
  ) {}

  make(options: Partial<TEntity> = {}): TEntity {
    return this._factory.create(options);
  }

  makeMany(count: number, options: Partial<TEntity> = {}): TEntity[] {
    return count.map<TEntity>(() => this.make(options));
  }

  makeManyFrom(options: Partial<TEntity>[]): TEntity[] {
    return options.length.map<TEntity>(idx => this.make(options[idx]));
  }

  async create(options: Partial<TEntity> = {}): Promise<TEntity> {
    const [e] = await this.createMany(1, options);
    return e;
  }

  async createMany(
    count: number,
    options: Partial<TEntity> = {}
  ): Promise<TEntity[]> {
    try {
      await this._queryRunner.connect();
      await this._queryRunner.startTransaction();

      let entities: TEntity[] = count.map<TEntity>(() =>
        this._factory.create(options)
      );

      entities = await this._queryRunner.manager.save(entities);

      await this._queryRunner.commitTransaction();

      return entities;
    } catch (e) {
      await this._queryRunner.rollbackTransaction();
      throw e;
    }
  }

  async createManyFrom(options: Partial<TEntity>[]): Promise<TEntity[]> {
    try {
      await this._queryRunner.connect();
      await this._queryRunner.startTransaction();

      let entities: TEntity[] = options.length.map<TEntity>(idx =>
        this._factory.create(options[idx])
      );

      entities = await this._queryRunner.manager.save(entities);

      await this._queryRunner.commitTransaction();

      return entities;
    } catch (e) {
      await this._queryRunner.rollbackTransaction();
      throw e;
    }
  }
}

export default ISeeder;
