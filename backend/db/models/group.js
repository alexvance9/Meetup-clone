'use strict';


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasOne(
        models.User,
        { foreignKey: organizerId }
      )
      Group.belongsToMany(
        models.Venue,
        {through: models.Event, foreignKey: 'groupId'}
      )
    }
  }
  Group.init({
    organizerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(60),
      validate : {
        len: {
          args: [1, 60],
          msg: "Name must be 60 characters or less"
        }
      }
    },
    about: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        // regex for is longer than 50 chars
        is: {
          args: /^.{ 50,}/,
          msg: "About must be 50 characters or more"
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
    private: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      validate: {
        isBoolean(value) {
          if (value !== true && value !== false){
            throw new Error("Private must be a boolean")
          }
        }
      }
    },
    city: {
      allowNull: false,
      type:DataTypes.STRING,
      validate: {
        notNull: {
          msg: "City is required"
        }
      }
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "State is required"
        }
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};