'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
   
    static associate(models) {
      GroupImage.belongsTo(
        models.Group,
        { foreignKey: 'groupId'}
      )
    }
  }
  GroupImage.init({
    groupId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    url: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    preview: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'GroupImage',
    defaultScope: {
      attributes: {
        exlude: ["createdAt", "updatedAt"]
      }
    }
  });
  return GroupImage;
};