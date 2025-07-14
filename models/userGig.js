// models/userGig.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGig extends Model {}
  UserGig.init(
    {
      userId: { type: DataTypes.UUID, primaryKey: true },
      gigId: { type: DataTypes.UUID, primaryKey: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'userGig', tableName: 'userGig' }
  );
  return UserGig;
};