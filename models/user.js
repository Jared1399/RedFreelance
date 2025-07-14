// models/user.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Category, { through: 'userCategory', foreignKey: 'userId' });
      User.belongsToMany(models.Gig, { through: 'userGig', foreignKey: 'userId' });
      User.hasMany(models.Transaction, { foreignKey: 'freelancerId', as: 'freelancerTransactions' });
      User.hasMany(models.Transaction, { foreignKey: 'clientId', as: 'clientTransactions' });
      User.hasMany(models.Feedback, { foreignKey: 'clientId', as: 'clientFeedback' });
      User.hasMany(models.Feedback, { foreignKey: 'freelancerId', as: 'freelancerFeedback' });
      User.hasMany(models.Portfolio, { foreignKey: 'userId' });
      User.hasMany(models.Notification, { foreignKey: 'userId' });
      User.hasMany(models.Ad, { foreignKey: 'userId' });
    }
  }
  User.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      passwordHash: DataTypes.STRING,
      identification: { type: DataTypes.STRING, unique: true },
      phone: DataTypes.STRING,
      isFreelancer: DataTypes.BOOLEAN,
      rankCommunity: DataTypes.FLOAT,
      rankPlatform: DataTypes.FLOAT,
      subscriptionPlan: DataTypes.ENUM('basic', 'pro'),
      subscriptionStart: DataTypes.DATE,
      subscriptionEnd: DataTypes.DATE,
      level: DataTypes.ENUM('novice', 'advanced', 'expert'),
      isVerified: DataTypes.BOOLEAN,
      warningCount: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'user', tableName: 'user' }
  );
  return User;
};