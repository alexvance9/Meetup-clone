'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: "246 Demo ln",
        city: "Bend",
        state: "OR",
        lat: 44.058090,
        lng: -121.315147
      },
      {
        groupId: 1,
        address: "135 Demo ln",
        city: "Bend",
        state: "OR",
        lat: 44.058090,
        lng: -121.315147
      },
      {
        groupId: 2,
        address: "333 Corn ave",
        city: "Corn",
        state: "OK",
        lat: 35.378010,
        lng: -98.780780
      },
      {
        groupId: 3,
        address: "5678 App Academy dr",
        city: "San Francisco",
        state: "CA",
        lat: 37.780079,
        lng: -122.420174
      },
    ])
  },

  async down (queryInterface, Sequelize) {
   options.tableName = 'Venues';
   const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ["246 Demo ln", "135 Demo ln", "333 Corn ave", "5678 App Academy dr"]}
    });
  }
};
