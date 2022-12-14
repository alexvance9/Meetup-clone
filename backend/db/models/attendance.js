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
      // Attendance.belongsToMany(
      //   models.User, 
      //   {foreignKey: 'userId'}
      // )
      // Attendance.belongsToMany(
      //   models.Event, 
      //   {foreignKey: 'eventId'}
      // )
    }
  }
  Attendance.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
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
      // defaultValue: 'pending',
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['pending', 'waitlist', 'attending', 'co-host', 'host']],
          msg: 'Invalid attendance status'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};