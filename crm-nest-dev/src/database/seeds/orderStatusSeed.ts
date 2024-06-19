import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { OrderStatus } from '../../entities';
import { TABLE_EMPTY_STATUS } from '../../constants';

export default class OrderStatusDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(OrderStatus).tableName;
    const query = await dataSource.query(
      'SELECT EXISTS(SELECT 1 FROM ' + tableName + ') as tableStatus',
    );
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(OrderStatus)
        .values([
          {
            name: 'NOT STARTED',
            colorCode: 'grey',
            isDefault: true,
            createdAt: new Date(),
          },
          {
            name: 'IN PROCESS',
            colorCode: 'red',
            isDefault: false,
            createdAt: new Date(),
          },
          {
            name: 'CANCELED',
            colorCode: 'blue',
            isDefault: false,
            createdAt: new Date(),
          },
          {
            name: 'ABANDONED',
            colorCode: 'green',
            isDefault: false,
            createdAt: new Date(),
          },
          {
            name: 'COMPLETED',
            colorCode: 'orange',
            isDefault: false,
            createdAt: new Date(),
          },
        ])
        .execute();
    }
  }
}
