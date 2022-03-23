'use strict';

const fs = require('fs');

module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    let tags = JSON.parse(fs.readFileSync('./data/tags.json', 'utf-8'));
    tags = tags.map(tag => {
      delete tag.id;
      tag.createdAt = tag.updatedAt = new Date();
      return tag;
    });

    return queryInterface.bulkInsert('Tags', tags);

  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete('Tags', null);
    
  }
};
