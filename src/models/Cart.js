"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.hasMany(models.Cartitem, {
        foreignKey: "cart_id",
        as: "CartCartitem",
      });
      Cart.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "UserCart",
      });
    }
  }
  Cart.init(
    {
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
      freezeTableName: true,
    }
  );
  return Cart;
};
