import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const isProduction = process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_HOST
      : process.env.DB_HOST,
  port:
    process.env.NODE_ENV === 'test'
      ? parseInt(process.env.TEST_DB_PORT as string, 10)
      : parseInt(process.env.DB_PORT as string, 10),
  password:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_PASSWORD
      : process.env.DB_PASSWORD,
  username:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_USERNAME
      : process.env.DB_USERNAME,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_NAME
      : process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
