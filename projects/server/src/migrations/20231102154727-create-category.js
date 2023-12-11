"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      propertyType: {
        type: Sequelize.ENUM("house", "apartment", "villa", "hotel", "room"),
      },
      country: {
        type: Sequelize.STRING,
      },
      province: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      streetAddress: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.INTEGER,
      },
      longitude: {
        type: Sequelize.INTEGER,
      },
      postalCode: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("categories");
  },
};
