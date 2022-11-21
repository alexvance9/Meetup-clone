'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendance.hasMany(
        models.User, 
        {foreignKey: userId}
      )
      Attendance.hasMany(
        models.Events, 
        {foreignKey: eventId}
      )
    }
  }
  Attendance.init({
    eventId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      defaultValue: 'pending',
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};