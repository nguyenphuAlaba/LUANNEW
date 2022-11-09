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
      Cart.belongsToMany(models.Product, {
        foreignKey: "cart_id",
        through: models.Cartitem,
        as: "ProductItemCart",
      });
      Cart.belongsTo(models.Customer, {
        foreignKey: "cus_id",
        targetKey: "id",
        as: "UserCart",
      });
    }
  }
  Cart.init(
    {
      cus_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
      freezeTableName: true,
    }
  );
  return Cart;
};
