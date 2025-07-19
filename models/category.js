'use strict';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../src/lib/db.js';

class Category extends Model {
  static associate(models) {
    Category.belongsToMany(models.User, { through: ' user_category', foreignKey: 'category_id' });
    Category.belongsToMany(models.Gig, { through: 'gig_category', foreignKey: 'gig_id' });
  }
}
Category.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, field: 'name' },
    description: DataTypes.TEXT,
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  },
  { sequelize, modelName: 'category', tableName: 'category' }
);

export default Category;
