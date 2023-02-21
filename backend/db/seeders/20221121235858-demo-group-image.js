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
        url: 'https://w0.peakpx.com/wallpaper/261/470/HD-wallpaper-alex-flame-names-name-human-name-design-people-person-name-your-names.jpg',
        preview: true
      },
      {
        groupId: 1,
        url: 'https://townsquare.media/site/87/files/2014/11/Vevo-via-YouTube.png?w=980&q=75',
        preview: false
      },
      {
        groupId: 2,
        url: 'https://chefsmandala.com/wp-content/uploads/2018/03/corn-600x338.jpg',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://miro.medium.com/max/1200/1*DTrU08K4jbRaq33u1PIFIA.jpeg',
        preview: true
      },
    ])
  
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4] }
    });
  }
};
