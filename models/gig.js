// models/gig.js
'use strict';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../src/lib/db.js';

class Gig extends Model {
  static associate(models) {
    Gig.belongsTo(models.User, { through: 'user_gig', foreignKey: 'gig_id' });
    Gig.hasMany(models.Transaction, { foreignKey: 'gig_id' });
    Gig.hasMany(models.Ad, { foreignKey: 'gig_id' });
    Gig.hasMany(models.Category, { through: 'gig_category', foreignKey: 'category_id' });
  }
}
Gig.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    categoryId: { type: DataTypes.INTEGER, field: 'category_id' },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(15, 2),
    status: DataTypes.ENUM('active', 'inactive', 'completed'),
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  },
  { sequelize, modelName: 'gig', tableName: 'gig' }
);

export default Gig;