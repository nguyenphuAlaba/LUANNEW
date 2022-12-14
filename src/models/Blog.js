"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //mot blog chi thuoc mot user
      Blog.belongsTo(models.Staff, {
        foreignKey: "sta_id",
        targetKey: "id",
        as: "UserBlog",
      });
    }
  }
  Blog.init(
    {
      name: DataTypes.STRING,
      Description: DataTypes.TEXT,
      sta_id: DataTypes.INTEGER,
      img: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Blog",
      freezeTableName: true,
    }
  );
  return Blog;
};
