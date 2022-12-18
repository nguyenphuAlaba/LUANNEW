"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warranty_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Warranty_info.belongsTo(models.Warranty, {
        foreignKey: "warranty_id",
        as: "WarrantyInfor",
        targetKey: "id",
      });
      Warranty_info.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "ProductInfor",
        targetKey: "id",
      });
      Warranty_info.belongsTo(models.Staff, {
        foreignKey: "sta_id",
        as: "StaffWarranty",
        targetKey: "id",
      });
    }
  }
  Warranty_info.init(
    {
      name: DataTypes.STRING,
      infor: DataTypes.STRING,
      description: DataTypes.TEXT,
      product_id: DataTypes.INTEGER,
      warranty_id: DataTypes.INTEGER,
      serinumber: DataTypes.STRING,
      sta_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Warranty_info",
      freezeTableName: true,
    }
  );
  return Warranty_info;
};
