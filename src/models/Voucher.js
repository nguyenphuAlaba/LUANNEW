"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Voucher.hasMany(models.Order, {
        foreignKey: "voucher_id",
        as: "OrderVoucher",
      });
      // Voucher.belongsTo(models.Uservoucher, {
      //   foreignKey: "voucher_id",
      //   as: "userVoucher",
      // });

      Voucher.belongsToMany(models.Customer, {
        as: "VoucherForCustomer",
        through: models.Uservoucher,
        foreignKey: "voucher_id",
      });

      //1 voucher thuoc 1 event
      Voucher.belongsTo(models.Event, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "VoucherEvent",
      });
    }
  }
  Voucher.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      sale: DataTypes.INTEGER,
      expire: DataTypes.DATE,
      event_id: DataTypes.INTEGER,
      maxuse: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Voucher",
      freezeTableName: true,
    }
  );
  return Voucher;
};
