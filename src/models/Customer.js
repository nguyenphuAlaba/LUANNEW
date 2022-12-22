"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Customer.hasMany(models.Viewed, {
        foreignKey: "cus_id",
        as: "UserView",
      });
      Customer.belongsToMany(models.Voucher, {
        as: "CustomerInVoucher",
        foreignKey: "cus_id",
        through: models.Uservoucher,
      });
      Customer.hasMany(models.Order, {
        foreignKey: "cus_id",
        as: "OrderUser",
      });
      Customer.hasMany(models.Comment, {
        foreignKey: "cus_id",
        as: "commentUser",
      });
      Customer.hasMany(models.Wishlist, {
        foreignKey: "cus_id",
        as: "UserWishlist",
      });
      Customer.hasOne(models.Cart, {
        foreignKey: "cus_id",
        as: "UserCart",
      });
      Customer.hasMany(models.Warranty, {
        foreignKey: "cus_id",
        as: "UserWarranty",
      });
      Customer.hasMany(models.CommentRespon, {
        foreignKey: "cus_id",
        as: "CustomerCommentRespon",
      });
    }
  }
  Customer.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullname: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      avatar: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      birthday: DataTypes.DATE,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Customer",
      freezeTableName: true,
    }
  );
  return Customer;
};
