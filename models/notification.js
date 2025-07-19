// models/notification.js
'use strict';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../src/lib/db.js';

class Notification extends Model {
  static associate(models) {
    Notification.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}
Notification.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    type: DataTypes.STRING,
    message: DataTypes.TEXT,
    isRead: { type: DataTypes.BOOLEAN, field: 'is_read' },
    relatedId: { type: DataTypes.STRING, field: 'related_id' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
  },
  { sequelize, modelName: 'notification', tableName: 'notification' }
);

export default Notification