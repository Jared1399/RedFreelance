'use strict';
//{ type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id:{ type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      identification: { type: Sequelize.STRING, unique: true, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      is_freelancer: { type: Sequelize.BOOLEAN, defaultValue: false },
      rank_community: { type: Sequelize.FLOAT, defaultValue: 0 },
      rank_platform: { type: Sequelize.FLOAT, defaultValue: 0 },
      subscription_start: { type: Sequelize.DATE, allowNull: true },
      subscription_end: { type: Sequelize.DATE, allowNull: true },
      is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
      warning_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      subscription_plan: {
        type: Sequelize.ENUM('basic', 'pro'),
        allowNull: false,
        defaultValue: 'basic'
      },
      level: {
        type: Sequelize.ENUM('novice', 'advanced', 'expert'),
        allowNull: false,
        defaultValue: 'novice'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
