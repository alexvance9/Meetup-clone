'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venue.hasMany(
        models.Event,
        {foreignKey: 'venueId'}
      )
      Venue.belongsTo(
        models.Group,
        {foreignKey: 'groupId'}
      )
    }
  }
  Venue.init({
    groupId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          // regex for street address pattern
          // args: /\d+\w+\s\w+\s\w+/,
          args: [1, 50],
          msg: "Street address is required"
        }
      }
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: "City is required"
        }
      }
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          
          args: [1, 50],
          msg: "State is required"
        }
      }
    },
    lat: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      validate: {
        min: {
          args: -90,
          msg: "Latitude is not valid"
        },
        max: {
          args: 90,
          msg: "Latitude is not valid"
        }
      }
    },
    lng: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      validate: {
        min: {
          args: -180,
          msg: "Longitude is not valid"
        },
        max: {
          args: 180,
          msg: "Longitude is not valid"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt']}
    }
  });
  return Venue;
};