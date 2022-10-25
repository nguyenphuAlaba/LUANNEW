"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 user thuoc 1 role
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        targetKey: "id",
        as: "UserRole",
      });
      User.belongsTo(models.Warehouse, {
        foreignKey: "warehouse_id",
        targetKey: "id",
        as: "Userwarehouse",
      });
      User.belongsTo(models.Store, {
        foreignKey: "store_id",
        targetKey: "id",
        as: "UserStore",
      });
      //mot user co nhieu viewed
      User.hasMany(models.Viewed, { foreignKey: "user_id", as: "UserView" });
      //1 user co nhieu wishlist
      User.hasMany(models.Wishlist, {
        foreignKey: "user_id",
        as: "UserWishlist",
      });
      //1 user co nhieu cart
      User.hasMany(models.Cart, {
        foreignKey: "user_id",
        as: "UserCart",
      });
      //1 user thuoc 1 dia chi
      User.hasMany(models.Address, {
        foreignKey: "user_id",
        as: "UserAddress",
      });

      //1 user co the post nhieu blog
      User.hasMany(models.Blog, {
        foreignKey: "user_id",
        as: "UserBlog",
      });

      // Quan he many to many //
      // 1 user co nhieu voucher
      // User.hasMany(models.Uservoucher, {
      //   foreignKey: "user_id",
      //   as: "userVoucherUser",
      // });

      User.belongsToMany(models.Voucher, {
        as: "UserInVoucher",
        through: models.Uservoucher,
        foreignKey: "user_id",
      });

      //1 user co nhieu comment
      User.hasMany(models.Comment, {
        foreignKey: "user_id",
        as: "commentUser",
      });
      // 1 User co nhieu order
      User.hasMany(models.Order, {
        foreignKey: "user_id",
        as: "OrderUser",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullname: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
      avatar: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      birthday: DataTypes.DATE,
      warehouse_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      freezeTableName: true,
    }
  );
  return User;
};
