// models/portfolio.js
'use strict';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../src/lib/db.js';

class Portfolio extends Model {
  static associate(models) {
    Portfolio.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}
Portfolio.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    fileUrl: { type: DataTypes.STRING, field: 'file_url' },
    externalUrl: { type: DataTypes.STRING, field: 'external_url' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  },
  { sequelize, modelName: 'portfolio', tableName: 'portfolio' }
);

export default Portfolio;