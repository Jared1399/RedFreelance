// models/userCategory.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCategory extends Model {}
  UserCategory.init(
    {
      userId: { type: DataTypes.UUID, primaryKey: true, field: 'user_id' },
      categoryId: { type: DataTypes.INTEGER, primaryKey: true, field: 'category_id' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, modelName: 'userCategory', tableName: 'user_category' }
  );
  return UserCategory;
};