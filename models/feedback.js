// models/feedback.js
'use strict';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../src/lib/db.js';

class Feedback extends Model {
  static associate(models) {
    Feedback.belongsTo(models.User, { foreignKey: 'client_id', as: 'client' });
    Feedback.belongsTo(models.User, { foreignKey: 'freelancer_id', as: 'freelancer' });
  }
}
Feedback.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    clientId: { type: DataTypes.UUID, field: 'client_id' },
    freelancerId: { type: DataTypes.UUID, field: 'freelancer_id' },
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  },
  { sequelize, modelName: 'feedback', tableName: 'feedback' }
);

export default Feedback;