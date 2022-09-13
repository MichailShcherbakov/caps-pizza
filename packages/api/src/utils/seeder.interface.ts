import { QueryRunner } from "typeorm";

export abstract class IFactory<T> {
  abstract create(options?: Partial<T>): T;
}

export abstract class ISeeder<TEntity> {
  constructor(
    protected _queryRunner: QueryRunner,
    protected _factory: IFactory<TEntity>
  ) {}

  async run(
    count: number,
    options?: Partial<TEntity> | Partial<TEntity>[]
  ): Promise<TEntity[]> {
    try {
      await this._queryRunner.connect();
      await this._queryRunner.startTransaction();

      const entities: TEntity[] = [];

      const query = Array.isArray(options) ? options : options ? [options] : [];
      const len = options ? Math.min(query.length, count) : count;

      for (let i = 0; i < len; ++i) {
        entities.push(
          await this._queryRunner.manager.save(
            this._factory.create(options && query[i])
          )
        );
      }

      await this._queryRunner.commitTransaction();

      return entities;
    } catch (e) {
      await this._queryRunner.rollbackTransaction();
      throw e;
    }
  }

  async seed(options: Partial<TEntity>): Promise<TEntity> {
    const [e] = await this.seeds([options]);
    return e;
  }

  async seeds(options: Partial<TEntity>[] = []): Promise<TEntity[]> {
    try {
      await this._queryRunner.connect();
      await this._queryRunner.startTransaction();

      const entities = await this._queryRunner.manager.save(
        options.map(o => this._factory.create(o))
      );

      await this._queryRunner.commitTransaction();

      return entities;
    } catch (e) {
      await this._queryRunner.rollbackTransaction();
      throw e;
    }
  }
}

export default ISeeder;
