"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Option.belongsToMany(models.Product, {
        foreignKey: "option_id",
        through: models.Option_Product,
        as: "OptionInProduct",
        otherKey: "product_id",
      });
    }
  }
  Option.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Option",
      freezeTableName: true,
    }
  );
  return Option;
};
