'use strict';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../src/lib/db.js';

class User extends Model {
  static associate(models) {
    User.belongsToMany(models.Category, { through: 'user_category', foreignKey: 'user_id' });
    User.hasMany(models.Gig, { through: 'user_gig', foreignKey: 'user_id' });
    User.hasMany(models.Transaction, { foreignKey: 'freelancer_id', as: 'freelancerTransactions' });
    User.hasMany(models.Transaction, { foreignKey: 'client_id', as: 'clientTransactions' });
    User.hasMany(models.Feedback, { foreignKey: 'client_id', as: 'clientFeedback' });
    User.hasMany(models.Feedback, { foreignKey: 'freelancer_id', as: 'freelancerFeedback' });
    User.hasOne(models.Portfolio, { foreignKey: 'user_id' });
    User.hasMany(models.Notification, { foreignKey: 'user_id' });
    User.hasMany(models.Ad, { foreignKey: 'user_id' });
  }
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING, field: 'first_name' },
    lastName: { type: DataTypes.STRING, field: 'last_name' },
    email: { type: DataTypes.STRING, unique: true },
    passwordHash: { type: DataTypes.STRING, field: 'password_hash' },
    identification: { type: DataTypes.STRING, unique: true },
    phone: DataTypes.STRING, isFreelancer: { type: DataTypes.BOOLEAN, field: 'is_freelancer' },
    rankCommunity: { type: DataTypes.FLOAT, field: 'rank_community' },
    rankPlatform: { type: DataTypes.FLOAT, field: 'rank_platform' },
    subscriptionPlan: { type: DataTypes.ENUM('basic', 'pro'), field: 'subscription_plan' },
    subscriptionStart: { type: DataTypes.DATE, field: 'subscription_start' },
    subscriptionEnd: { type: DataTypes.DATE, field: 'subscription_end' },
    level: DataTypes.ENUM('novice', 'advanced', 'expert'),
    isVerified: { type: DataTypes.BOOLEAN, field: 'is_verified' },
    warningCount: { type: DataTypes.INTEGER, field: 'warning_count' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' },
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
