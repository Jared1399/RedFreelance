// migrations/20250713000001-createUser.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      identification: { type: Sequelize.STRING, unique: true, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: true },
      is_freelancer: { type: Sequelize.BOOLEAN, defaultValue: false },
      rank_community: { type: Sequelize.FLOAT, defaultValue: 0 },
      rank_platform: { type: Sequelize.FLOAT, defaultValue: 0 },
      subscription_plan: { type: Sequelize.ENUM('basic', 'pro'), defaultValue: 'basic', allowNull: false },
      subscription_start: { type: Sequelize.DATE, allowNull: true },
      subscription_end: { type: Sequelize.DATE, allowNull: true },
      level: { type: Sequelize.ENUM('novice', 'advanced', 'expert'), defaultValue: 'novice', allowNull: false },
      is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
      warning_count: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('user');
  },
};