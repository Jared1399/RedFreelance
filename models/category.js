// models/category.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.User, { through: 'userCategory', foreignKey: 'categoryId' });
      Category.hasMany(models.Gig, { foreignKey: 'categoryId' });
    }
  }
  Category.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'category', tableName: 'category' }
  );
  return Category;
};