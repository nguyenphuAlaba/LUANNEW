"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cartitem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ////////////////////////////////////////////////////////////////
      //mot cartitem co nhieu product
      Cartitem.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetkey: "id",
        as: "CartItemProduct",
      });
      //mot cartitem co nhieu cart
      Cartitem.belongsTo(models.Cart, {
        foreignKey: "cart_id",
        targetKey: "id",
        as: "Cartitem",
      });
    }
  }
  Cartitem.init(
    {
      product_id: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      cart_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cartitem",
      freezeTableName: true,
    }
  );
  return Cartitem;
};
