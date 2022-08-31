const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const Hotel = sequelize.define('hotel', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  },
  ubication: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imgUrl: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
module.exports = { Hotel };