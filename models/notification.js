// models/notification.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Notification.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: DataTypes.UUID,
      type: DataTypes.STRING,
      message: DataTypes.TEXT,
      isRead: DataTypes.BOOLEAN,
      relatedId: DataTypes.STRING,
      createdAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'notification', tableName: 'notification' }
  );
  return Notification;
};