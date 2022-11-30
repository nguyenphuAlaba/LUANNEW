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

      Product.hasMany(models.Viewed, {
        foreignKey: "product_id",
        as: "ViewProduct",
      });
      Product.hasMany(models.Wishlist, {
        foreignKey: "product_id",
        as: "ProductWishlist",
      });
      Product.hasMany(models.Comment, {
        foreignKey: "product_id",
        as: "CommentProduct",
      });
      Product.hasMany(models.Warranty, {
        foreignKey: "product_id",
        as: "ProductWarranty",
      });
      Product.belongsToMany(models.Warehouse, {
        foreignKey: "product_id",
        through: models.Warehouse_product,
        as: "ProductInWarehouse",
      });
      Product.belongsToMany(models.Order, {
        foreignKey: "product_id",
        as: "ProductInOrder",
        through: models.Orderitem,
      });
      Product.belongsToMany(models.Cart, {
        foreignKey: "product_id",
        through: models.Cartitem,
        as: "ProductInCart",
      });
      Product.belongsToMany(models.Option, {
        foreignKey: "product_id",
        through: models.Option_Product,
        as: "ProductOption",
        otherKey: "option_id",
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
