"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 cmt chi thuoc 1 user
      Comment.belongsTo(models.Customer, {
        foreignKey: "cus_id",
        targetKey: "id",
        as: "commentUser",
      });
      Comment.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetKey: "id",
        as: "CommentProduct",
      });
    }
  }
  Comment.init(
    {
      cus_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      rate: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Comment",
      freezeTableName: true,
    }
  );
  return Comment;
};
