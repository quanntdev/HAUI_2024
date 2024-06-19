import { Factory, Seeder } from "typeorm-seeding";
import { DataSource } from "typeorm";
import { Industry } from "../../entities";
import { TABLE_EMPTY_STATUS } from "../../constants";

export default class IndustryDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(Industry).tableName;
    const query = await dataSource.query("SELECT EXISTS(SELECT 1 FROM " + tableName + ") as tableStatus");
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Industry)
        .values([
          { name: "Accommodation and Food Services", createdAt: new Date() },
          { name: "Information", createdAt: new Date() },
          { name: "Construction", createdAt: new Date() },
          { name: "Finance and Insurance", createdAt: new Date() },
          { name: "Professional, Scientific and Technical Services", createdAt: new Date() },
          { name: "Retail Trade", createdAt: new Date() },
          { name: "Wholesale Trade", createdAt: new Date() },
          { name: "Manufacturing", createdAt: new Date() },
          { name: "Utilities", createdAt: new Date() },
          { name: "Specialist Engineering, Infrastructure and Contractors", createdAt: new Date() },
          { name: "Technology", createdAt: new Date() },
          { name: "Industrial Machinery, Gas and Chemicals", createdAt: new Date() },
          { name: "Real Estate and Rental and Leasing", createdAt: new Date() },
          { name: "Healthcare and Social Assistance", createdAt: new Date() },
          { name: "Other Services", createdAt: new Date() },
        ])
        .execute();
    }
  }
}
