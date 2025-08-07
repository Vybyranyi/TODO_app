const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Task = require('./Task')(sequelize, Sequelize.DataTypes);

db.User.associate(db);
db.Task.associate(db);

module.exports = db;
