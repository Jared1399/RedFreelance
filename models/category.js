// models/category.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.User, { through: ' user_category', foreignKey: 'category_id' });
      Category.belongsToMany(models.Gig, { through: 'gig_category', foreignKey: 'gig_id' });
    }
  }
  Category.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, field: 'name' },
      description: DataTypes.TEXT,
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, modelName: 'category', tableName: 'category' }
  );
  return Category;
};