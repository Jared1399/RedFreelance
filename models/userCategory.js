// models/userCategory.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCategory extends Model {}
  UserCategory.init(
    {
      userId: { type: DataTypes.UUID, primaryKey: true },
      categoryId: { type: DataTypes.INTEGER, primaryKey: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'userCategory', tableName: 'userCategory' }
  );
  return UserCategory;
};