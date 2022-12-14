import db from "../models/index";
// import bcrypt from "bcryptjs";
// import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// var salt = bcrypt.genSaltSync(10);
// var cloudinary = require("cloudinary").v2;

let getAllBlog = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let blog = await db.Blog.findAll();
      resolve({
        errCode: 0,
        errMessage: "Ok",
        blog,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getAllBlogByCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let blog = await db.Blog.findAll({
        where: { cat_id: id },
        raw: false,
        nest: true,
      });
      resolve({
        blog,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let createBlog = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data: ", data);
      let blog = await db.Blog.findOne({
        where: { name: data.name },
      });
      if (blog) {
        resolve({
          errCode: 1,
          errMessage: "Your Blog has been Exists",
        });
      } else {
        await db.Blog.create({
          Description: data.Description,
          sta_id: data.sta_id,
          name: data.name,
          img: data.img,
        });
        resolve({
          errCode: 0,
          errMessage: "Create Blog Successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateBlog = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.id) {
        let blog = await db.Blog.findOne({
          where: { id: data.id },
          raw: false,
          nest: true,
        });
        if (blog) {
          if (data.sta_id == blog.sta_id) {
            // console.log(data.user_id, blog.user_id);
            // console.log(data.Description, blog.Description);
            // console.log(data.cat_id, blog.cat_id);
            // console.log(data.name, blog.name);
            blog.Description = data.Description;
            blog.name = data.name;
            blog.img = data.img;
            console.log(blog);
            await blog.save();
            resolve({
              errCode: 0,
              errMessage: "Update Successfully",
            });
          } else {
            resolve({
              errCode: 1,
              errMessage: "You not allow to Update a blog",
            });
          }
        } else {
          resolve({
            errCode: 2,
            errMessage: "Can't find your blog",
          });
        }
      } else {
        resolve({
          errCode: 3,
          errMessage: "Missing id",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteBlog = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing id",
        });
      } else {
        let blog = await db.Blog.findOne({
          where: { id: id },
          raw: false,
          nest: true,
        });
        if (!blog) {
          resolve({
            errCode: 2,
            errMessage: "Can't find blog",
          });
        } else {
          await db.Blog.destroy({
            where: { id: id },
          });
          resolve({
            errCode: 0,
            errMessage: "Delete blog has successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
  getAllBlogByCategory,
};
