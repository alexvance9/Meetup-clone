'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: 'sample.com/sampleimg1',
        preview: true
      },
      {
        groupId: 1,
        url: 'sample.com/sampleimg2',
        preview: false
      },
      {
        groupId: 2,
        url: 'sample.com/sampleimg3',
        preview: true
      },
      {
        groupId: 3,
        url: 'sample.com/sampleimg4',
        preview: true
      },
    ])
  
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
