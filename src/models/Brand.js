"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 brand thi co nhieu product
      Brand.hasMany(models.Product, {
        foreignKey: "brand_id",
        as: "ProductBrand",
      });
    }
  }
  Brand.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Brand",
      freezeTableName: true,
    }
  );
  return Brand;
};
