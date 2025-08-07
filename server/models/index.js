import Sequelize from 'sequelize';
import sequelize from '../config/db.js';
import defineUser from './User.js';
import defineTask from './Task.js';

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = defineUser(sequelize, Sequelize.DataTypes);
db.Task = defineTask(sequelize, Sequelize.DataTypes);

Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

export default db;
