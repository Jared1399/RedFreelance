// migrations/20250713000009-createTransaction.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction', {
      id:{ type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      freelancerId: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      clientId: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      gigId: {
        type: Sequelize.UUID,
        references: { model: 'gig', key: 'id' },
        allowNull: false,
      },
      lifecycleId: {
        type: Sequelize.INTEGER,
        references: { model: 'lifecycle', key: 'id' },
        allowNull: false,
      },
      amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      commission: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      commissionRate: { type: Sequelize.FLOAT, defaultValue: 0.10, allowNull: false },
      paymentId: { type: Sequelize.STRING, allowNull: true },
      escrowStatus: {
        type: Sequelize.ENUM('held', 'released', 'refunded'),
        defaultValue: 'held',
        allowNull: false,
      },
      completed: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('transaction', ['completed']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('transaction');
  },
};