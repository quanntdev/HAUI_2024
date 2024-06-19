import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { TABLE_EMPTY_STATUS } from '../../constants';
import { InvoiceCategory } from '../../entities';

export default class InvoiceCategorySeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(InvoiceCategory).tableName;
    const query = await dataSource.query(
      `SELECT EXISTS(SELECT 1 FROM ${tableName}) as tableStatus`,
    );
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(InvoiceCategory)
        .values([
          {
            name: 'SERVICE',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            name: 'OTHER',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ])
        .execute();
    }
  }
}
