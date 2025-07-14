// migrations/20250713000005-createFeedback.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('feedback', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      clientId: {
        type: Sequelize.UUID,
        references: { model: 'user', key: 'id' },
        allowNull: false,
      },
      freelancerId: {
        type: Sequelize.UUID,
        references: { model: 'user', key: 'id' },
        allowNull: false,
      },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('feedback');
  },
};