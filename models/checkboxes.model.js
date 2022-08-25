const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const Checkboxes = sequelize.define('checkboxes', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lavabajillas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Habitaciones: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  frigobar: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  desayuno: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  yacuzzi: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vistaalmar: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

});

module.exports = { Checkboxes };