"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warehouse_staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Warehouse_staff.belongsTo(models.Warehouse, {
        foreignKey: "warehouses_id",
        targetKey: "id",
        as: "Warehousestaff",
      });
      Warehouse_staff.belongsTo(models.Staff, {
        foreignKey: "sta_id",
        targetKey: "id",
        as: "Staffwarehouse",
      });
    }
  }
  Warehouse_staff.init(
    {
      sta_id: DataTypes.INTEGER,
      warehouse_id: DataTypes.INTEGER,
      starttime: DataTypes.DATE,
      endtime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Warehouse_staff",
      freezeTableName: true,
    }
  );
  return Warehouse_staff;
};
