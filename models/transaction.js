// models/transaction.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'freelancerId', as: 'freelancer' });
      Transaction.belongsTo(models.User, { foreignKey: 'clientId', as: 'client' });
      Transaction.belongsTo(models.Gig, { foreignKey: 'gigId' });
      Transaction.belongsTo(models.Lifecycle, { foreignKey: 'lifecycleId' });
    }
  }
  Transaction.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      freelancerId: DataTypes.UUID,
      clientId: DataTypes.UUID,
      gigId: DataTypes.UUID,
      lifecycleId: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL(15, 2),
      commission: DataTypes.DECIMAL(15, 2),
      commissionRate: DataTypes.FLOAT,
      paymentId: DataTypes.STRING,
      escrowStatus: DataTypes.ENUM('held', 'released', 'refunded'),
      completed: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'transaction', tableName: 'transaction' }
  );
  return Transaction;
};