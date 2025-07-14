// models/feedback.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.User, { foreignKey: 'clientId', as: 'client' });
      Feedback.belongsTo(models.User, { foreignKey: 'freelancerId', as: 'freelancer' });
    }
  }
  Feedback.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      clientId: DataTypes.UUID,
      freelancerId: DataTypes.UUID,
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'feedback', tableName: 'feedback' }
  );
  return Feedback;
};