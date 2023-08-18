const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn.js');

const User = require('./User.js');

const Thought = sequelize.define('Thought', {
  id: {
    type: DataTypes.UUID,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Thought.belongsTo(User);
User.hasMany(Thought);

module.exports = Thought;
