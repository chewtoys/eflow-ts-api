import { Op } from 'sequelize';

interface IConfig {
  [index: string]: any;
}
export const config: IConfig = {
  development: {
    username: 'postgres',
    password: null,
    database: 'eflow_ts_dev',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
    pool: {
      max: 30,
      min: 0,
      idle: 1000000,
      acquire: 1000000,
    },
  },
  stage: {
    username: 'postgres',
    password: null,
    database: 'eflow_ts_stage',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
    pool: {
      max: 30,
      min: 0,
      idle: 1000000,
      acquire: 1000000,
    },
  },
  test: {
    username: 'postgres',
    password: null,
    database: 'eflow_ts_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
    pool: {
      max: 30,
      min: 0,
      idle: 1000000,
      acquire: 1000000,
    },
  },
  production: {
    username: 'postgres',
    password: null,
    database: 'eflow_ts_production',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
    pool: {
      max: 30,
      min: 0,
      idle: 1000000,
      acquire: 1000000,
    },
  },
};
