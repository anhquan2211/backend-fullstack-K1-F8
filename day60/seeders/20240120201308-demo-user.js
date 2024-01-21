"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const hash = bcrypt.hash("123456", saltRounds);
    const passwordHash = await hash;
    return queryInterface.bulkInsert("users", [
      {
        name: "Anh Quan Dev",
        email: "anhquanst2211@gmail.com",
        password: passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
