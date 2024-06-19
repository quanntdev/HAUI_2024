import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { BillingType } from '../../entities';
import { TABLE_EMPTY_STATUS } from '../../constants';

export default class BillingTypeDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(BillingType).tableName;
    const query = await dataSource.query(
      'SELECT EXISTS(SELECT 1 FROM ' + tableName + ') as tableStatus',
    );
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(BillingType)
        .values([
          {
            name: 'Time Material',
            isDefault: false,
            createdAt: new Date(),
          },
          {
            name: 'Project Based',

            isDefault: true,
            createdAt: new Date(),
          },
        ])
        .execute();
    }
  }
}
