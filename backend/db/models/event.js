'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasOne(
        models.Venue,
        {foreignKey: 'venueId'}
      )
      Event.hasOne(
        models.Group,
        {foreignKey: 'groupId'}
      )
      Event.belongsToMany(
        models.User,
        {through: models.Attendance, foreignKey: 'eventId'}
      )
    }
  }
  Event.init({
    venueId: {
      allowNull: false,
      type:DataTypes.INTEGER,
    },
    groupId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5,],
          msg: "Name must be at least 5 characters"
        }
      }
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notNull: {
          msg: "Description is required"
        }
      }
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["In Person", "Online"]],
          msg: "Type must be 'Online' or 'In person'"
        }
      }
    },
    capacity: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 2,
          msg: 'Capacity must be at least 2'
        },
        isInt: {
          msg: "Capacity must be an integer"
        }
      }
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        notNull: {
          msg: "Price is invalid"
        }
      }
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        isAfter: {
          args: new Date(),
          msg: "Start date must be in the future"
        }
      }
    },
    endDate: {
      allowNull: false,
     type: DataTypes.DATE,
     validate: {
      endDateAfterStartDate(input){
        if (input < this.startDate){
          throw new Error()
        }
      }
     }
    }  
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};