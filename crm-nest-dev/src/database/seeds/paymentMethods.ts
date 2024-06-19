import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { TABLE_EMPTY_STATUS } from '../../constants';
import { PaymentMethod } from '../../entities';

export default class InvoiceCategorySeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(PaymentMethod).tableName;
    const query = await dataSource.query(
      `SELECT EXISTS(SELECT 1 FROM ${tableName}) as tableStatus`,
    );
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(PaymentMethod)
        .values([
          {
            name: 'CASH',
            createdAt: new Date(),
          },
          {
            name: 'PAYPAL',
            createdAt: new Date(),
          },
          {
            name: 'CREDIT CARD',
            createdAt: new Date(),
          },
          {
            name: 'BANKING',
            createdAt: new Date(),
          },
        ])
        .execute();
    }
  }
}
