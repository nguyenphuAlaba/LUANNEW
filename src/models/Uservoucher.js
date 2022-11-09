"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Uservoucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 uservoucher thuoc 1 voucher
      Uservoucher.belongsTo(models.Voucher, {
        foreignKey: "voucher_id",
        targetKey: "id",
        as: "Voucher",
      });
      //1 uservoucher thuoc 1 user
      Uservoucher.belongsTo(models.Customer, {
        foreignKey: "cus_id",
        targetKey: "id",
        as: "Customer",
      });
    }
  }
  Uservoucher.init(
    {
      cus_id: DataTypes.INTEGER,
      voucher_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Uservoucher",
      freezeTableName: true,
    }
  );
  return Uservoucher;
};
