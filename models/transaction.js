// models/transaction.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'freelancer_id', as: 'freelancer' });
      Transaction.belongsTo(models.User, { foreignKey: 'client_id', as: 'client' });
      Transaction.belongsTo(models.Gig, { foreignKey: 'gig_id' });
      Transaction.belongsTo(models.Lifecycle, { foreignKey: 'lifecycle_id' });
    }
  }
  Transaction.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      freelancerId: { type: DataTypes.UUID, field: 'freelancer_id' },
      clientId: { type: DataTypes.UUID, field: 'client_id' },
      gigId: { type: DataTypes.UUID, field: 'gig_id' },
      lifecycleId: { type: DataTypes.INTEGER, field: 'lifecycle_id' },
      amount: DataTypes.DECIMAL(15, 2),
      commission: DataTypes.DECIMAL(15, 2),
      commissionRate: { type: DataTypes.FLOAT, field: 'commission_rate' },
      paymentId: { type: DataTypes.STRING, field: 'payment_id' },
      escrowStatus: { type: DataTypes.ENUM('held', 'released', 'refunded'), field: 'escrow_status' },
      completed: DataTypes.BOOLEAN,
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, modelName: 'transaction', tableName: 'transaction' }
  );
  return Transaction;
};