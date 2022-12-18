"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Warranty_info", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      infor: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      product_id: {
        type: Sequelize.INTEGER,
      },
      warranty_id: {
        type: Sequelize.INTEGER,
      },
      serinumber: {
        type: Sequelize.STRING,
      },
      sta_id: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Warranty_info");
  },
};
