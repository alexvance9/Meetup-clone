'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
   
    static associate(models) {
      // Membership.hasOne(
      //   models.Group,
      //   {foreignKey: 'groupId'}
      // )
      // Membership.hasOne(
      //   models.User,
      //   {foreignKey: 'userId'}
      // )
    }
  }
  Membership.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    groupId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};