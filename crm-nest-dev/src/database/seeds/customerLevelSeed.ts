import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { CustomerLevel } from '../../entities';
import { TABLE_EMPTY_STATUS } from '../../constants';

export default class CustomerLevelDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(CustomerLevel).tableName;
    const query = await dataSource.query(
      'SELECT EXISTS(SELECT 1 FROM ' + tableName + ') as tableStatus',
    );
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(CustomerLevel)
        .values([
          {
            name: 'L1',
            description: "Customer's information is unconfirmed",
            createdAt: new Date(),
          },
          {
            name: 'L2',
            description:
              "Potential Customers Level, Customer's information is confirmed and the contact is responded",
            createdAt: new Date(),
          },
          {
            name: 'L3',
            description:
              'Confirming that there is a need to follow to launch a project',
            createdAt: new Date(),
          },
          {
            name: 'L4',
            description:
              'Customers have started to hand over the project to QI for consulting',
            createdAt: new Date(),
          },
          {
            name: 'L5',
            description: 'Customers are ordering with QI',
            createdAt: new Date(),
          },
        ])
        .execute();
    }
  }
}
