"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //mot product thi co nhieu hinh
      // Product.hasMany(models.Product_Image, {
      //   foreignKey: "product_id",
      //   targetkey: "id",
      //   as: "ProductImg",
      // });
      // // 1 product chi co 1 brand
      Product.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        targetkey: "id",
        as: "ProductBrand",
      });

      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        targetkey: "id",
        as: "CategoryProduct",
      });
      Product.hasMany(models.Warehouse_product, {
        foreignKey: "product_id",
        as: "productwarehouse_product",
      });
      Product.hasMany(models.Viewed, {
        foreignKey: "product_id",
        as: "ViewProduct",
      });
      Product.hasMany(models.Wishlist, {
        foreignKey: "product_id",
        as: "ProductWishlist",
      });
      Product.hasMany(models.Cartitem, {
        foreignKey: "product_id",
        as: "CartItemProduct",
      });
      Product.hasMany(models.Comment, {
        foreignKey: "product_id",
        as: "CommentProduct",
      });
      Product.hasMany(models.Option_Product, {
        foreignKey: "product_id",
        as: "Option_Product",
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      unitprice: DataTypes.DOUBLE,
      currentQuantity: DataTypes.INTEGER,
      IntialQuantity: DataTypes.INTEGER,
      Description: DataTypes.STRING,
      status: DataTypes.INTEGER,
      brand_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      img: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Product",
      freezeTableName: true,
    }
  );
  return Product;
};
