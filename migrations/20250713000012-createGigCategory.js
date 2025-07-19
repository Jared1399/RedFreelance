'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('gig_category', {
      gig_id: {
        type: Sequelize.UUID,
        references: { model: 'gig', key: 'id' },
        field: 'gig_id',
        onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'category', key: 'id' },
        field: 'category_id',
        onDelete: 'CASCADE'
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addConstraint('gig_category', {
      fields: ['gig_id', 'category_id'],
      type: 'primary key',
      name: 'gig_category_pk',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('gig_category');
  }
};