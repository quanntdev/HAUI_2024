import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Currency } from '../../entities';

export default class SeedCurrencyDefault implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const data = await dataSource
      .createQueryBuilder()
      .select('currencies')
      .from(Currency, 'currencies')
      .where("currencies.id = :id", {id: 2})
      .getOne();

      data.default = true;

      await dataSource.getRepository(Currency).save(data);
  }
}
