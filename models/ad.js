// models/ad.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ad extends Model {
    static associate(models) {
      Ad.belongsTo(models.Gig, { foreignKey: 'gig_id' });
      Ad.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Ad.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gigId: { type: DataTypes.UUID, field: 'gig_id' },
      userId: { type: DataTypes.UUID, field: 'user_id' },
      startDate: { type: DataTypes.DATEONLY, field: 'start_date' },
      endDate: { type: DataTypes.DATEONLY, field: 'end_date' },
      amountPaid: { type: DataTypes.DECIMAL(15, 2), field: 'amount_paid' },
      status: DataTypes.ENUM('active', 'inactive'),
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, modelName: 'ad', tableName: 'ad' }
  );
  return Ad;
};