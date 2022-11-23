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
      defaultValue: 'pending',
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["organizer", "co-host", "member", "pending"]],
          msg: "invalid membership status"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};