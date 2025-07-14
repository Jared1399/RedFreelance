// models/gig.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gig extends Model {
    static associate(models) {
      Gig.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Gig.belongsToMany(models.User, { through: 'userGig', foreignKey: 'gigId' });
      Gig.hasMany(models.Transaction, { foreignKey: 'gigId' });
      Gig.hasMany(models.Ad, { foreignKey: 'gigId' });
    }
  }
  Gig.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      categoryId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL(15, 2),
      status: DataTypes.ENUM('active', 'inactive', 'completed'),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'gig', tableName: 'gig' }
  );
  return Gig;
};