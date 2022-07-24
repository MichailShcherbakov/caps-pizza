import { DataSource } from "typeorm";

export abstract class IFactory<T> {
  abstract create(options?: Partial<T>): T;
}

export abstract class ISeeder<TEntity> {
  constructor(
    protected _dataSource: DataSource,
    protected _factory: IFactory<TEntity>
  ) {}

  async run(
    count: number,
    options?: Partial<TEntity> | Partial<TEntity>[]
  ): Promise<TEntity[]> {
    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entities: TEntity[] = [];
      const query = Array.isArray(options) ? options : options ? [options] : [];
      const len = options ? Math.min(query.length, count) : count;

      for (let i = 0; i < len; ++i) {
        entities.push(
          await this._dataSource.manager.save(
            this._factory.create(options && query[i])
          )
        );
      }

      await queryRunner.commitTransaction();

      return entities;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async seed(options?: Partial<TEntity>): Promise<TEntity> {
    const [e] = await this.run(1, options);
    return e;
  }
}

export default ISeeder;
