"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Option_Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
      Option_Product.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetKey: "id",
        as: "Product",
      });
      Option_Product.belongsTo(models.Option, {
        foreignKey: "option_id",
        targetKey: "id",
        as: "Option",
      });
    }
  }
  Option_Product.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.DOUBLE,
      product_id: DataTypes.INTEGER,
      option_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Option_Product",
      freezeTableName: true,
    }
  );
  return Option_Product;
};
