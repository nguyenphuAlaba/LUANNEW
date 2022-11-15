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
      Warehouse.belongsToMany(models.Staff, {
        foreignKey: "warehouse_id",
        through: models.Warehouse_staff,
        as: "WarehouseeStaff",
      });
      Warehouse.belongsToMany(models.Product, {
        foreignKey: "warehouse_id",
        through: models.Warehouse_product,
        as: "WarehouseProduct",
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
