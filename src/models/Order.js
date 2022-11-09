"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 order chi thuoc 1 user
      Order.belongsTo(models.Customer, {
        foreignKey: "cus_id",
        targetKey: "id",
        as: "OrderUser",
      });
      Order.belongsTo(models.Paymentmethod, {
        foreignKey: "method_id",
        as: "MethodOrder",
        targetKey: "id",
      });
      Order.belongsTo(models.Voucher, {
        foreignKey: "voucher_id",
        targetKey: "id",
        as: "OrderVoucher",
      });
      Order.belongsToMany(models.Product, {
        foreignKey: "order_id",
        through: models.Orderitem,
        as: "OrderProductItem",
      });
    }
  }
  Order.init(
    {
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      status: DataTypes.INTEGER,
      Address: DataTypes.STRING,
      phonenumber: DataTypes.INTEGER,
      voucher_id: DataTypes.INTEGER,
      method_id: DataTypes.INTEGER,
      cus_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
      freezeTableName: true,
    }
  );
  return Order;
};
