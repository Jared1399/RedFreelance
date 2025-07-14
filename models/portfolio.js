// models/portfolio.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    static associate(models) {
      Portfolio.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Portfolio.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: DataTypes.UUID,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      fileUrl: DataTypes.STRING,
      externalUrl: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'portfolio', tableName: 'portfolio' }
  );
  return Portfolio;
};