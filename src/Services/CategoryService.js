import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await db.Category.findAll({
        raw: false,
        nest: true,
      });
      resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};
let checkCategory = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      let categoryname = await db.Category.findOne({
        where: { name: category },
      });
      if (categoryname) resolve(true);
      else resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};
let createCategory = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkCategory(category.name);
      console.log("category " + category.name);
      if (check) {
        resolve({
          errCode: 1,
          errMessage: "This category already exists",
        });
      } else {
        await db.Category.create({
          name: category.name,
          parent_id: category.parent_id,
        });
        resolve({
          errCode: 0,
          errMessage: "add category successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateCategory = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!category.id) {
        resolve({
          errCode: 2,
          errMessage: "Can't find category with id",
        });
      } else {
        let fcategory = await db.Category.findOne({
          where: { id: category.id },
          raw: false,
          nest: true,
        });
        let ccategory = await checkCategory(category.name);
        if (ccategory) {
          resolve({
            errCode: 1,
            errMessage: "category already exists",
          });
        } else {
          fcategory.name = category.name;
          fcategory.parent_id = category.parent_id;
          await fcategory.save();
          //delete category old
          resolve({
            errCode: 0,
            errMessage: "category have been updated successfully",
          });
        }
      }
    } catch (error) {
      console.log("Error");
      reject(error);
    }
  });
};
let deleteCategory = (category_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await db.Category.findOne({
        where: { id: category_id },
      });
      if (category) {
        let product = await db.Product.findOne({
          where: { category_id: category_id },
        });
        if (!product) {
          await db.Category.destroy({
            where: { id: category_id },
          });
          resolve({
            errCode: 1,
            errMessage: "Category has been deleted",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Category cannot deleted because have product",
          });
        }
      } else {
        resolve({
          errCode: 3,
          errMessage: "Category not exists",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createCategory,
  updateCategory,
  getAllCategory,
  deleteCategory,
};
