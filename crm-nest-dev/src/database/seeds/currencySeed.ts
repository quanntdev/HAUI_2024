import { Factory, Seeder } from "typeorm-seeding";
import { DataSource } from "typeorm";
import { Currency } from "../../entities";
import { TABLE_EMPTY_STATUS } from "../../constants";

export default class CurrencyDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(Currency).tableName;
    const query = await dataSource.query("SELECT EXISTS(SELECT 1 FROM " + tableName + ") as tableStatus");
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Currency)
        .values([
          { name: "JPY", sign: "¥", created_at: new Date() },
          { name: "VND", sign: "₫", created_at: new Date() },
          { name: "USD", sign: "$", created_at: new Date() },
        ])
        .execute();
    }
  }
}
