'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        eventId: 1,
        status: 'host'
      },
      {
        userId: 1,
        eventId: 2,
        status: 'host'
      },
      {
        userId: 2,
        eventId: 3,
        status: 'host'
      },
      {
        userId: 3,
        eventId: 3,
        status: 'pending'
      },
      {
        userId: 3,
        eventId: 4,
        status: 'host'
      },
      {
        userId: 4,
        eventId: 4,
        status: 'pending'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    });
  }
};
