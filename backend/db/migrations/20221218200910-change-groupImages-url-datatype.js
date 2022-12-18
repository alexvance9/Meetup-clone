'use strict';

// const { DataTypes } = require('sequelize');

let options = {};
options.tableName = 'GroupImages';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn(options, 'url', {
      allowNull: false,
      type: Sequelize.TEXT,
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn(options, 'url', {
      allowNull: false,
      type: Sequelize.STRING
    })

  }
};
