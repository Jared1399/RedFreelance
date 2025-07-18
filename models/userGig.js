// models/userGig.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGig extends Model {}
  UserGig.init(
    {
      userId: { type: DataTypes.UUID, primaryKey: true, field: 'user_id' },
      gigId: { type: DataTypes.UUID, primaryKey: true, field: 'gig_id' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, modelName: 'userGig', tableName: 'user_gig' }
  );
  return UserGig;
};