'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  options.tableName = 'EventImages';
  return queryInterface.bulkInsert(options, [
    {
      eventId: 1,
      url: 'sample.com/sampleimage',
      preview: true
    },
    {
      eventId: 2,
      url: 'sample.com/sampleimage',
      preview: true
    },
    {
      eventId: 3,
      url: 'sample.com/sampleimage',
      preview: true
    },
  ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    });
  }
};
