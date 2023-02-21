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
        name: "Alex Hangout",
        type: "Online",
        capacity: 10,
        price: 1.50,
        description: "A really fun event where all of us Alex's get together and gab about Alex related topics. Topics including: What does an Alex like to eat? How should an Alex interact with non-Alex's? Where does an Alex come from? Where does an Alex go?",
        startDate: new Date(2023, 3, 3),
        endDate: new Date(2023, 3, 4)
      },
      {
        groupId: 1,
        venueId: 2,
        name: "Alex's being Alex's: Panel Discussion",
        type: "Online",
        capacity: 10,
        price: 1.50,
        description: "A panel of our best and brightest Alex's discuss getting ahead and staying ahead.",
        startDate: new Date(2023, 3, 5),
        endDate: new Date(2023, 3, 6)
      },
      {
        groupId: 2,
        venueId: 3,
        name: "Corntastic!",
        type: "In Person",
        capacity: 10,
        price: 1.50,
        description: "What we talk about when we talk about corn! As always, we will have a super corn-y potluck, everyone is welcome to participate! Bring your favorite corn dish and be ready to talk corn varieties with special guest Dr. Corn-ell West!",
        startDate: new Date(2023, 3, 2),
        endDate: new Date(2071, 3, 3)
      },
      {
        groupId: 3,
        venueId: 4,
        name: "Group Therapy",
        type: "Online",
        capacity: 10,
        price: 1.50,
        description: "This week's topic: Will we ever find jobs? We invited back some past bootcamp grads who have been on the other side of the job search. As they've all been recently laid off, they have lots of time to meet with everyone and lend their support... and we agreed to let them pitch their start-up ideas! Fun for one and all!",
        startDate: new Date(2023, 3, 1),
        endDate: new Date(2023, 3, 2)
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Demo Event", "Demo Event 2", "Corn Event", "Group Therapy"] }
    });
  }
};
