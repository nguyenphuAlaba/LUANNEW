"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentRespon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 cmt chi thuoc 1 user
      CommentRespon.belongsTo(models.Comment, {
        foreignKey: "comment_id",
        targetKey: "id",
        as: "CommentRespon",
      });
    }
  }
  CommentRespon.init(
    {
      comment_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CommentRespon",
      freezeTableName: true,
    }
  );
  return CommentRespon;
};
