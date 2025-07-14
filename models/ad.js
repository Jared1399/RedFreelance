// models/ad.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ad extends Model {
    static associate(models) {
      Ad.belongsTo(models.Gig, { foreignKey: 'gigId' });
      Ad.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Ad.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gigId: DataTypes.UUID,
      userId: DataTypes.UUID,
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      amountPaid: DataTypes.DECIMAL(15, 2),
      status: DataTypes.ENUM('active', 'inactive'),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'ad', tableName: 'ad' }
  );
  return Ad;
};