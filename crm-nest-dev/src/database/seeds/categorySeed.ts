import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Category } from '../../entities';
import { TABLE_EMPTY_STATUS } from '../../constants';

export default class CategoryDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(Category).tableName;
    const query = await dataSource.query(
      'SELECT EXISTS(SELECT 1 FROM ' + tableName + ') as tableStatus',
    );
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values([
          { name: 'Web', created_at: new Date() },
          { name: 'App', created_at: new Date() },
          { name: 'Web/App', created_at: new Date() },
          { name: 'Labor', created_at: new Date() },
        ])
        .execute();
    }
  }
}
