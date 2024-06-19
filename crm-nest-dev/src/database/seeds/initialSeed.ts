import { Factory, Seeder } from "typeorm-seeding";
import { DataSource } from "typeorm";
import { User } from "../../entities";
import * as bcrypt from 'bcrypt';
import config from '../../config';
import { TABLE_EMPTY_STATUS } from "../../constants";

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(User).tableName;
    const query = await dataSource.query("SELECT EXISTS(SELECT 1 FROM " + tableName + ") as tableStatus");
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      const password = await bcrypt.hash(
        config.ADMIN_PASSWORD,
        + (config.BCRYPT_SALT_ROUND)
      )
      await factory(User)().create({ password });
    }
  }
}
