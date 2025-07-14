// migrations/20250713000004-createAd.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ad', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      gigId: {
        type: Sequelize.UUID,
        references: { model: 'gig', key: 'id' },
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: 'user', key: 'id' },
        allowNull: false,
      },
      startDate: { type: Sequelize.DATEONLY, allowNull: false },
      endDate: { type: Sequelize.DATEONLY, allowNull: false },
      amountPaid: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('ad');
  },
};