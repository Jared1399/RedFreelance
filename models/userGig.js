// models/userGig.js
'use strict';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../src/lib/db.js';

class UserGig extends Model { }
UserGig.init(
  {
    userId: { type: DataTypes.UUID, primaryKey: true, field: 'user_id' },
    gigId: { type: DataTypes.UUID, primaryKey: true, field: 'gig_id' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  },
  { sequelize, modelName: 'userGig', tableName: 'user_gig' }
);

export default UserGig;