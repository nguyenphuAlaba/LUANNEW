"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Warranty", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
      },
      infor: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      // store_id: {
      //   type: Sequelize.INTEGER,
      // },
      // product_id: {
      //   type: Sequelize.INTEGER,
      // },
      order_id: {
        type: Sequelize.INTEGER,
      },
      cus_id: {
        type: Sequelize.INTEGER,
      },
      expire: {
        type: Sequelize.DATE,
      },

      // sta_id: {
      //   type: Sequelize.INTEGER,
      // },
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
    await queryInterface.dropTable("Warranty");
  },
};
