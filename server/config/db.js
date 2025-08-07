import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('todo_db', 'postgres', '12345678', {
  host: 'localhost',
  dialect: 'postgres',
  logging: true,
});

export default sequelize;
