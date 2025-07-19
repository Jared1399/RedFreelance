// models/lifecycle.js
'use strict';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../src/lib/db.js';

class Lifecycle extends Model {
  static associate(models) {
    Lifecycle.hasMany(models.Transaction, { foreignKey: 'lifecycle_id' });
  }
}
Lifecycle.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  },
  { sequelize, modelName: 'lifecycle', tableName: 'lifecycle' }
);

export default Lifecycle;