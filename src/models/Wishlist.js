"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //mot wishlist co nhieu product
      // Wishlist.hasMany(models.Product, {
      //   foreignKey: "product_id",
      //   targetkey: "id",
      //   as: "ProductWishlist",
      // });

      Wishlist.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetkey: "id",
        as: "ProductWishlist",
      });

      //mot wishlist chi thuoc ve mot user
      Wishlist.belongsTo(models.User, {
        foreignKey: "user_id",
        targetkeys: "id",
        as: "UserWishlist",
      });
    }
  }
  Wishlist.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Wishlist",
      freezeTableName: true,
    }
  );
  return Wishlist;
};
