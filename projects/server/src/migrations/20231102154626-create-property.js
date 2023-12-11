"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("properties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      propertyName: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      roomCount: {
        type: Sequelize.INTEGER,
      },
      bedCount: {
        type: Sequelize.INTEGER,
      },
      bedroomCount: {
        type: Sequelize.INTEGER,
      },
      maxGuestCount: {
        type: Sequelize.INTEGER,
      },
      bathroomCount: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      coverImage: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("properties");
  },
};
