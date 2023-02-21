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
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxC-5w5jGNT1diEO8AEhZ5EMni60BY4Ux1Pg&usqp=CAU',
      preview: true
    },
    {
      eventId: 2,
      url: 'https://media-cldnry.s-nbcnews.com/image/upload/newscms/2020_30/1545251/alex-trebek-today-main-200304.jpg',
      preview: true
    },
    {
      eventId: 3,
      url: 'https://www.acouplecooks.com/wp-content/uploads/2019/07/Elote-Recipe-018.jpg',
      preview: true
    },
    {
      eventId: 4,
      url: 'https://www.aiche.org/sites/default/files/images/Chenected/postlegacylead/dilbertengineersoul.jpg',
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
