import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { City } from '../../entities';
import { Country } from '../../entities';
import { TABLE_EMPTY_STATUS } from '../../constants';
const listProvinceVN = [
  {
    name: 'Thành phố Hà Nội',
  },
  {
    name: 'Tỉnh Hà Giang',
  },
  {
    name: 'Tỉnh Cao Bằng',
  },
  {
    name: 'Tỉnh Bắc Kạn',
  },
  {
    name: 'Tỉnh Tuyên Quang',
  },
  {
    name: 'Tỉnh Lào Cai',
  },
  {
    name: 'Tỉnh Điện Biên',
  },
  {
    name: 'Tỉnh Lai Châu',
  },
  {
    name: 'Tỉnh Sơn La',
  },
  {
    name: 'Tỉnh Yên Bái',
  },
  {
    name: 'Tỉnh Hoà Bình',
  },
  {
    name: 'Tỉnh Thái Nguyên',
  },
  {
    name: 'Tỉnh Lạng Sơn',
  },
  {
    name: 'Tỉnh Quảng Ninh',
  },
  {
    name: 'Tỉnh Bắc Giang',
  },
  {
    name: 'Tỉnh Phú Thọ',
  },
  {
    name: 'Tỉnh Vĩnh Phúc',
  },
  {
    name: 'Tỉnh Bắc Ninh',
  },
  {
    name: 'Tỉnh Hải Dương',
  },
  {
    name: 'Thành phố Hải Phòng',
  },
  {
    name: 'Tỉnh Hưng Yên',
  },
  {
    name: 'Tỉnh Thái Bình',
  },
  {
    name: 'Tỉnh Hà Nam',
  },
  {
    name: 'Tỉnh Nam Định',
  },
  {
    name: 'Tỉnh Ninh Bình',
  },
  {
    name: 'Tỉnh Thanh Hóa',
  },
  {
    name: 'Tỉnh Nghệ An',
  },
  {
    name: 'Tỉnh Hà Tĩnh',
  },
  {
    name: 'Tỉnh Quảng Bình',
  },
  {
    name: 'Tỉnh Quảng Trị',
  },
  {
    name: 'Tỉnh Thừa Thiên Huế',
  },
  {
    name: 'Thành phố Đà Nẵng',
  },
  {
    name: 'Tỉnh Quảng Nam',
  },
  {
    name: 'Tỉnh Quảng Ngãi',
  },
  {
    name: 'Tỉnh Bình Định',
  },
  {
    name: 'Tỉnh Phú Yên',
  },
  {
    name: 'Tỉnh Khánh Hòa',
  },
  {
    name: 'Tỉnh Ninh Thuận',
  },
  {
    name: 'Tỉnh Bình Thuận',
  },
  {
    name: 'Tỉnh Kon Tum',
  },
  {
    name: 'Tỉnh Gia Lai',
  },
  {
    name: 'Tỉnh Đắk Lắk',
  },
  {
    name: 'Tỉnh Đắk Nông',
  },
  {
    name: 'Tỉnh Lâm Đồng',
  },
  {
    name: 'Tỉnh Bình Phước',
  },
  {
    name: 'Tỉnh Tây Ninh',
  },
  {
    name: 'Tỉnh Bình Dương',
  },
  {
    name: 'Tỉnh Đồng Nai',
  },
  {
    name: 'Tỉnh Bà Rịa - Vũng Tàu',
  },
  {
    name: 'Thành phố Hồ Chí Minh',
  },
  {
    name: 'Tỉnh Long An',
  },
  {
    name: 'Tỉnh Tiền Giang',
  },
  {
    name: 'Tỉnh Bến Tre',
  },
  {
    name: 'Tỉnh Trà Vinh',
  },
  {
    name: 'Tỉnh Vĩnh Long',
  },
  {
    name: 'Tỉnh Đồng Tháp',
  },
  {
    name: 'Tỉnh An Giang',
  },
  {
    name: 'Tỉnh Kiên Giang',
  },
  {
    name: 'Thành phố Cần Thơ',
  },
  {
    name: 'Tỉnh Hậu Giang',
  },
  {
    name: 'Tỉnh Sóc Trăng',
  },
  {
    name: 'Tỉnh Bạc Liêu',
  },
  {
    name: 'Tỉnh Cà Mau',
  },
];

const listProvinceJP = [
  {
    name: 'Aichi',
  },
  {
    name: 'Akita',
  },
  {
    name: 'Aomori',
  },
  {
    name: 'Chiba',
  },
  {
    name: 'Ehime',
  },
  {
    name: 'Fukuoka',
  },
  {
    name: 'Fukushima',
  },
  {
    name: 'Fukui',
  },
  {
    name: 'Gifu',
  },
  {
    name: 'Gunma',
  },
  {
    name: 'Hokkaido',
  },
  {
    name: 'Hiroshima',
  },
  {
    name: 'Hyogo',
  },
  {
    name: 'Ibaraki',
  },
  {
    name: 'Ishikawa',
  },
  {
    name: 'Iwate',
  },
  {
    name: 'Kagoshima',
  },
  {
    name: 'Kagawa',
  },
  {
    name: 'Kumamoto',
  },
  {
    name: 'Kanagawa',
  },
  {
    name: 'Kochi',
  },
  {
    name: 'Kyoto',
  },
  {
    name: 'Mie',
  },
  {
    name: 'Miyagi',
  },
  {
    name: 'Miyazaki',
  },
  {
    name: 'Nara',
  },
  {
    name: 'Nagano',
  },
  {
    name: 'Nagasaki',
  },
  {
    name: 'Niigata',
  },
  {
    name: 'Oita',
  },
  {
    name: 'Okinawa',
  },
  {
    name: 'Okayama',
  },
  {
    name: 'Osaka',
  },
  {
    name: 'Saga',
  },
  {
    name: 'Shiga',
  },
  {
    name: 'Shimane',
  },
  {
    name: 'Saitama',
  },
  {
    name: 'Shizuoka',
  },
  {
    name: 'Tochigi',
  },
  {
    name: 'Tottori',
  },
  {
    name: 'Tokushima',
  },
  {
    name: 'Tokyo',
  },
  {
    name: 'Toyama',
  },
  {
    name: 'Wakayama',
  },
  {
    name: 'Yamaguchi',
  },
  {
    name: 'Yamanashi',
  },
  {
    name: 'Yamagata',
  },
];

export default class CityDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tableName = dataSource.getMetadata(City).tableName;
    const query = await dataSource.query(
      'SELECT EXISTS(SELECT 1 FROM ' + tableName + ') as tableStatus',
    );
    if (query[0].tableStatus == TABLE_EMPTY_STATUS) {
      const country = new Country();
      country.id = 2;
      const listPVN = listProvinceVN.map((province: any) => ({
        ...province,
        country,
      }));
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(City)
        .values(listPVN)
        .execute();

      country.id = 1;
      const listPJP = listProvinceJP.map((province: any) => ({
        ...province,
        country,
      }));
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(City)
        .values(listPJP)
        .execute();
    }
  }
}
