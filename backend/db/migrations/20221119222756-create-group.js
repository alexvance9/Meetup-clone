'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users"
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(60),
      },
      about: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM("Online", "In Person"),
      },
      private: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Groups', options);
  }
};