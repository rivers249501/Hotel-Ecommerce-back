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
  Cocina: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Aire_acondicionado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Piscina: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Estacionamiento_techado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Microondas: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Wifi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Jacuzzy: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Frigobar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Lavadora: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Baño_en_suite: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Sala_fitness: {
    type: DataTypes.STRING,
    allowNull: false
  },

});

module.exports = { Checkboxes };