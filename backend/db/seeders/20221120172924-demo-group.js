'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'Groups';
   return queryInterface.bulkInsert(options, [
    {
      organizerId: 1,
      name: 'DemoGroup1',
      about: 'This is a group about making seeders to check our validators.',
      type: 'Online',
      private: true,
      city: 'Bend',
      state: 'OR',
    },
    {
      organizerId: 2,
      name: 'Corn Appreciation Group',
      about: 'This is a group that gathers to discuss all things corn-related!',
      type: 'In Person',
      private: false,
      city: 'Corn',
      state: 'OK',
    },
    {
      organizerId: 3,
      name: 'SWE Bootcamp Support Group',
      about: 'If you are in the midst of a grueling tech bootcamp and feeling like you need some support, look no further! We gather once a week to commiserate and share resources. Good luck finding the time though!',
      type: 'Online',
      private: true,
      city: 'San Francisco',
      state: 'CA',
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['DemoGroup1', 'Corn Appreciation Group', 'SWE Bootcamp Support Group'] }
    }, {});
  
  }
};
