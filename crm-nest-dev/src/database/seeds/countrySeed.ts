import { Factory, Seeder } from "typeorm-seeding";
import { DataSource } from "typeorm";
import { Country } from "../../entities";
import { TABLE_EMPTY_STATUS } from "../../constants";

export default class CountryDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(Country).tableName;
    const query = await dataSource.query("SELECT EXISTS(SELECT 1 FROM " + tableName + ") as tableStatus");
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Country)
        .values([
          { name: 'JP', updatedAt: new Date() },
          { name: 'VN', updatedAt: new Date() },
        ])
        .execute();
    }
  }
}
