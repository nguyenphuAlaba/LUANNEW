"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_Image.belongsTo(models.Blog, {
        foreignKey: "blog_id",
        targetKey: "id",
        as: "UserImage",
      });
    }
  }
  User_Image.init(
    {
      img: DataTypes.TEXT,
      blog_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_Image",
      freezeTableName: true,
    }
  );
  return User_Image;
};
