"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Warehouse_staff", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sta_id: {
        type: Sequelize.INTEGER,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
      },
      starttime: {
        type: Sequelize.DATE,
      },
      endtime: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Warehouse_staff");
  },
};
