'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GigCategory extends Model {}
  GigCategory.init(
    {
      categoryId: { type: DataTypes.UUID, primaryKey: true, field: 'category_id' },
      gigId: { type: DataTypes.UUID, primaryKey: true, field: 'gig_id' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, modelName: 'gigCategory', tableName: 'gig_category' }
  );
  return GigCategory;
};