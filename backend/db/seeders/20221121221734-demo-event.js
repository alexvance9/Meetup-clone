'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: "Demo Event",
        type: "Online",
        capacity: 10,
        price: 1.50,
        description: "A really fun event",
        startDate: new Date(2070, 1, 1),
        endDate: new Date(2071, 1, 1)
      },
      {
        groupId: 1,
        venueId: 2,
        name: "Demo Event 2",
        type: "Online",
        capacity: 10,
        price: 1.50,
        description: "a way more fun event",
        startDate: new Date(2070, 1, 1),
        endDate: new Date(2071, 1, 1)
      },
      {
        groupId: 2,
        venueId: 3,
        name: "Corn Event",
        type: "In Person",
        capacity: 10,
        price: 1.50,
        description: "What we talk about when we talk about corn",
        startDate: new Date(2070, 1, 1),
        endDate: new Date(2071, 1, 1)
      },
      {
        groupId: 3,
        venueId: 4,
        name: "Group Therapy",
        type: "Online",
        capacity: 10,
        price: 1.50,
        description: "Topic: Will we ever find jobs?",
        startDate: new Date(2070, 1, 1),
        endDate: new Date(2071, 1, 1)
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Demo Event", "Demo Event 2", "Corn Event", "Group Therapy"] }
    }, {});
  }
};
