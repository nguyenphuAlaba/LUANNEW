"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orderitem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 orderitem thuoc 1 order
      Orderitem.belongsTo(models.Order, {
        foreignKey: "order_id",
        targetKey: "id",
        as: "orderItem",
      });
      Orderitem.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetKey: "id",
        as: "oderItemProduct",
      });
    }
  }
  Orderitem.init(
    {
      product_id: DataTypes.INTEGER,
      price: DataTypes.DOUBLE,
      order_id: DataTypes.INTEGER,
      TotalQuantity: DataTypes.INTEGER,
      optionValues: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    {
      sequelize,
      modelName: "Orderitem",
      freezeTableName: true,
    }
  );
  return Orderitem;
};
