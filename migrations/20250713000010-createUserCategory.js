// migrations/20250713000010-createUserCategory.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_category', {
      user_id: {
        type: Sequelize.UUID,
        references: { model: 'user', key: 'id' },
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'category', key: 'id' },
        allowNull: false,
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('user_category', {
      fields: ['user_id', 'category_id'],
      type: 'primary key',
      name: 'user_category_pk',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('user_category');
  },
};