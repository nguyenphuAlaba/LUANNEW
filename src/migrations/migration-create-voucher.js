"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Voucher", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      sale: {
        type: Sequelize.INTEGER,
      },
      expire: {
        type: Sequelize.DATE,
      },
      event_id: {
        type: Sequelize.INTEGER,
      },
      maxuse: {
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
    await queryInterface.dropTable("Voucher");
  },
};
