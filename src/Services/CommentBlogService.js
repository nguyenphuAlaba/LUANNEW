import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllCommentblogOfProductRate = (blog) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(blog);
      let Commentblog = await db.Commentblog.findAll({
        include: [
          {
            model: db.Blog,
            as: "CommentBlog",
            where: { id: blog },
          },
          { model: db.User, as: "CommentBlogUser", attributes: ["fullname"] },
        ],
        raw: false,
        nest: true,
      });
      resolve(Commentblog);
    } catch (error) {
      reject(error);
    }
  });
};
let addCommentblog = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("id: " + data.user_id);
      let checkUser = await db.User.findOne({
        where: { id: data.user_id },
      });
      if (checkUser) {
        let checkblog = await db.Blog.findOne({
          where: { id: data.blog_id },
        });
        if (checkblog) {
          await db.Commentblog.create({
            user_id: data.user_id,
            blog_id: data.blog_id,
            comment: data.comment,
            rate: data.rate,
            status: data.status,
          });
          resolve({
            errCode: 0,
            errMessage: "Has been add Commentblog",
            data,
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Your blog hasn't exist",
          });
        }
      } else {
        resolve({
          errCode: 2,
          errMessage: "Your user hasn't exist",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateCommentblog = (Commentblog) => {
  return new Promise(async (resolve, reject) => {
    try {
      let fCommentblog = await db.Commentblog.findOne({
        include: [
          {
            model: db.User,
            as: "CommentBlogUser",
            where: { id: Commentblog.user_id },
          },
          {
            model: db.Blog,
            as: "CommentBlog",
            where: { id: Commentblog.blog_id },
          },
        ],
        raw: false,
        nest: true,
      });
      if (fCommentblog) {
        fCommentblog.description = Commentblog.description;
        fCommentblog.status = 1;
        fCommentblog.rate = Commentblog.rate;

        await fCommentblog.save();
        resolve({
          errCode: 0,
          errMessage: "Update Commentblog Successfully",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Update Commentblog failed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteCommentBlog = (commentblog) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!commentblog) {
        resolve({
          errCode: 1,
          errMessage: "Missing id",
        });
      } else {
        let ccoment = await db.Commentblog.findOne({
          where: { id: commentblog },
        });
        if (!ccoment) {
          resolve({ errCode: 1, errMessage: "Cannot find Commentblog id" });
        } else {
          await db.Comment.destroy({
            where: { id: commentblog },
          });
          resolve({
            errCode: 0,
            errMessage: "Delete Comment Blog Successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getAllCommentblogOfProductRate,
  addCommentblog,
  updateCommentblog,
  deleteCommentBlog,
};
