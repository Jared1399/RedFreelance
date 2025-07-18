import pg from 'pg';
import { Sequelize } from 'sequelize';
import config from '../../config/config.json';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.url,
  {
    dialect: dbConfig.dialect,
    dialectModule: pg,
    logging: false,
  }
);


async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connectDB();

export { sequelize };