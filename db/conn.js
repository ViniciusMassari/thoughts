const { Sequelize } = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize('thoughts', 'root', process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

try {
  sequelize.authenticate();
  console.log('conectamos');
} catch (error) {
  console.error('não foi possível conectar', error);
}

module.exports = sequelize;
