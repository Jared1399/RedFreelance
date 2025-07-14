// models/lifecycle.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lifecycle extends Model {
    static associate(models) {
      Lifecycle.hasMany(models.Transaction, { foreignKey: 'lifecycleId' });
    }
  }
  Lifecycle.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'lifecycle', tableName: 'lifecycle' }
  );
  return Lifecycle;
};