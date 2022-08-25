const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const HotelInCart = sequelize.define('hotelincart', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  }
});

module.exports = { HotelInCart };
