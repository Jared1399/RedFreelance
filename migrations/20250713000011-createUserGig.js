// migrations/20250713000011-createUserGig.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_gig', {
      user_id: {
        type: Sequelize.UUID,
        references: { model: 'user', key: 'id' },
        allowNull: false,
      },
      gig_id: {
        type: Sequelize.UUID,
        references: { model: 'gig', key: 'id' },
        allowNull: false,
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('user_gig', {
      fields: ['user_id', 'gig_id'],
      type: 'primary key',
      name: 'user_gig_pk',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('user_gig');
  },
};