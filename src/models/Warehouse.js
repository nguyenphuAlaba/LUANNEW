"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Warehouse.hasMany(models.User, {
        foreignKey: "warehouse_id",
        as: "Userwarehouse",
      });
      Warehouse.hasMany(models.Warehouse_product, {
        foreignKey: "warehouse_id",
        as: "UserwarehouseProduct",
      });
    }
  }
  Warehouse.init(
    {
      address: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Warehouse",
      freezeTableName: true,
    }
  );
  return Warehouse;
};
