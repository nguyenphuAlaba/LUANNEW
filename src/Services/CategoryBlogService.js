import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllCategoryBlog = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let CategoryBlog = await db.Categoryblog.findAll({
        raw: false,
        nest: true,
      });
      resolve(CategoryBlog);
    } catch (error) {
      reject(error);
    }
  });
};
let checkCategoryBlog = (CategoryBlog) => {
  return new Promise(async (resolve, reject) => {
    try {
      let CategoryBlogname = await db.Categoryblog.findOne({
        where: { cat_name: CategoryBlog },
      });
      if (CategoryBlogname) resolve(true);
      else resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};
let createCategoryBlog = (CategoryBlog) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!CategoryBlog.cat_name) {
        resolve({
          errCode: 1,
          errMessage: "Missing category blog name",
        });
      } else {
        let check = await checkCategoryBlog(CategoryBlog.cat_name);
        if (check) {
          resolve({
            errCode: 2,
            errMessage: "This CategoryBlog already exists",
          });
        } else {
          console.log("CategoryBlog " + CategoryBlog.cat_name);
          await db.Categoryblog.create({
            cat_name: CategoryBlog.cat_name,
          });
          resolve({
            errCode: 0,
            errMessage: "add CategoryBlog successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateCategoryBlog = (CategoryBlog) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!CategoryBlog.id || !CategoryBlog.cat_name) {
        resolve({
          errCode: 2,
          errMessage: "Can't find CategoryBlog with id or cat name",
        });
      } else {
        let fCategoryBlog = await db.Categoryblog.findOne({
          where: { id: CategoryBlog.id },
          raw: false,
          nest: true,
        });
        if (!fCategoryBlog) {
          resolve({
            errCode: 1,
            errMessage: "Can't find category please check id",
          });
        } else {
          let cCategoryBlog = await checkCategoryBlog(CategoryBlog.cat_name);
          if (cCategoryBlog) {
            resolve({
              errCode: 2,
              errMessage: "CategoryBlog already exists",
            });
          } else {
            fCategoryBlog.cat_name = CategoryBlog.cat_name;
            await fCategoryBlog.save();
            //delete CategoryBlog old
            resolve({
              errCode: 0,
              errMessage: "CategoryBlog have been updated successfully",
            });
          }
        }
      }
    } catch (error) {
      console.log("Error");
      reject(error);
    }
  });
};
let deleteCategoryBlog = (CategoryBlog_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let CategoryBlog = await db.Categoryblog.findOne({
        where: { id: CategoryBlog_id },
      });
      if (CategoryBlog) {
        let product = await db.Blog.findOne({
          where: { cat_id: CategoryBlog_id },
        });
        if (!product) {
          await db.Categoryblog.destroy({
            where: { id: CategoryBlog_id },
          });
          resolve({
            errCode: 1,
            errMessage: "CategoryBlog has been deleted",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "CategoryBlog cannot deleted because have blog",
          });
        }
      } else {
        resolve({
          errCode: 3,
          errMessage: "CategoryBlog not exists",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createCategoryBlog,
  updateCategoryBlog,
  getAllCategoryBlog,
  deleteCategoryBlog,
};
