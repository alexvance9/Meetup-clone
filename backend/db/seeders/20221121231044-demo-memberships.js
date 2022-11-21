'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'Memberships';
   return queryInterface.bulkInsert(options, [
     {
       userId: 1,
       groupId: 1,
       status: "organizer"
     },
     {
       userId: 2,
       groupId: 2,
       status: "organizer"
     },
     {
       userId: 3,
       groupId: 3,
       status: "organizer"
     },
     {
       userId: 4,
       groupId: 3,
       status: "member"
     }
  ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
