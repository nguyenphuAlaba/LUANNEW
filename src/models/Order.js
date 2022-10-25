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
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
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
      Order.hasMany(models.Orderitem, {
        foreignKey: "order_id",
        as: "orderItem",
      });
;
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
      totalprice: DataTypes.DOUBLE,
      method_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
      freezeTableName: true,
    }
  );
  return Order;
};
