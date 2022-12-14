'use strict';
const { Model, Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    // toSafeObject method will return an object with only safe info for JWT, in this case id, username, email.
    
    toSafeObject() {
      const { id, firstName, lastName, username, email } = this; // context will be the User instance
      return { id, firstName, lastName, username, email };
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }

    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ firstName, lastName, username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    }

    static associate(models) {
      User.belongsToMany(
        models.Group,
        {as: "member", through: models.Membership, foreignKey: 'userId'}
      )
      User.belongsToMany(
        models.Event,
        {through: models.Attendance, foreignKey: 'userId'}
      )
      User.hasMany(
        models.Group,
        {as: "organizer", foreignKey: 'organizerId'}
      )
    }
  };

  User.init(
    {
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [3, 256],
          isEmail: true
        },
        unique: {
          args: true,
          msg: 'User with that email already exists'
        }
      },
      hashedPassword: {
        allowNull: false,
        type: DataTypes.STRING.BINARY,
        validate: {
          len: [60, 60]
        }
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName : {
        allowNull: false,
        type: DataTypes.STRING,
      }
    }, 
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword", "createdAt", "updatedAt"] }
        },
        loginUser: {
          attributes: {}
        }
      }
    }
  );
  return User;
};