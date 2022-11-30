"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warehouse_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Warehouse_product.belongsTo(models.Warehouse, {
        foreignKey: "warehouse_id",
        as: "UserwarehouseProduct",
        targetKey: "id",
      });
      Warehouse_product.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "productwarehouse_product",
        targetKey: "id",
      });
    }
  }
  Warehouse_product.init(
    {
      product_id: DataTypes.INTEGER,
      warehouse_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      color_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Warehouse_product",
      freezeTableName: true,
    }
  );
  return Warehouse_product;
};
