import "reflect-metadata"
import { DataSource } from 'typeorm';

import dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource( {
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.BD_USERNAME,
  password: `${process.env.BD_PASSWORD}`,
  database: process.env.DATABASE,
  synchronize: process.env.SYNCHRONIZE === 'false' ? false : true,
  logging: process.env.LOGGING === 'true' ? true : false,
  entities: [__dirname + '/entity/*.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
  subscribers: [],
});

export default AppDataSource;