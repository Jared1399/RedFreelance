// migrations/20250713000005-createFeedback.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('feedback', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      client_id: {
        type:Sequelize.UUID,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      freelancer_id: {
        type:Sequelize.UUID,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('feedback');
  },
};