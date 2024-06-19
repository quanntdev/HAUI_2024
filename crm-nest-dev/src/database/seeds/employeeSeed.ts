import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { EmployeeConfig } from '../../entities';
import { TABLE_EMPTY_STATUS } from '../../constants';

export default class EmployeeDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(EmployeeConfig).tableName;
    const query = await dataSource.query(
      'SELECT EXISTS(SELECT 1 FROM ' + tableName + ') as tableStatus',
    );
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(EmployeeConfig)
        .values([
          { start_number: 0, end_number: 50, created_at: new Date() },
          { start_number: 50, end_number: 200, created_at: new Date() },
          { start_number: 200, end_number: 500, created_at: new Date() },
          { start_number: 500, end_number: 1000, created_at: new Date() },
          { start_number: 1000, end_number: 9999, created_at: new Date() },
        ])
        .execute();
    }
  }
}
