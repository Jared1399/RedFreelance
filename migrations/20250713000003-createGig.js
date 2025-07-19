// migrations/20250713000003-createGig.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('gig', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      price: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'completed'),
        defaultValue: 'active',
        allowNull: false,
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('gig');
  },
};