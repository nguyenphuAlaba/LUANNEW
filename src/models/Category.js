"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //mot category co nhieu product
      Category.hasMany(models.Product, {
        foreignKey: "category_id",
        as: "categoryProduct",
      });

      // Danh muc cha con //
      Category.hasMany(Category, {
        as: "ChildrenCategoty",
        foreignKey: "parent_id",
        useJunctionTable: false,
      });
      Category.belongsTo(Category, {
        as: "parent",
        foreignKey: "parent_id",
        targetKey: "id",
      });
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      parent_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Category",
      freezeTableName: true,
    }
  );
  return Category;
};
