"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Cartitem", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      product_id: {
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      cart_id: {
        type: Sequelize.INTEGER,
      },
      optionvalue: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      price: {
        type: Sequelize.DOUBLE,
      },
      ttprice: {
        type: Sequelize.DOUBLE,
      },
      warehouse_id: {
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
    await queryInterface.dropTable("Cartitem");
  },
};
