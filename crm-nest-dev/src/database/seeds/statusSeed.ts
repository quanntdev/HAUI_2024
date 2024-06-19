import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Status } from '../../entities';
import { TABLE_EMPTY_STATUS } from '../../constants';

export default class StatusDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(Status).tableName;
    const query = await dataSource.query(
      'SELECT EXISTS(SELECT 1 FROM ' + tableName + ') as tableStatus',
    );
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Status)
        .values([
          {
            name: 'NEW',
            colorCode: 'grey',
            isDefault: true,
            createdAt: new Date(),
          },
          {
            name: 'QUALIFIED',
            colorCode: 'red',
            isDefault: false,
            createdAt: new Date(),
          },
          {
            name: 'PROPOSAL SENT',
            colorCode: 'orange',
            isDefault: false,
            createdAt: new Date(),
          },
          {
            name: 'CONTRACT',
            colorCode: 'green',
            isDefault: false,
            createdAt: new Date(),
          },

          {
            name: 'DELAYED',
            colorCode: 'blue',
            isDefault: false,
            createdAt: new Date(),
          },
          {
            name: 'WON',
            colorCode: 'green',
            isDefault: false,
            createdAt: new Date(),
          },
          {
            name: 'LOST',
            colorCode: 'grey',
            isDefault: false,
            createdAt: new Date(),
          },
        ])
        .execute();
    }
  }
}
