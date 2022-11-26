import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllBrand = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let brand = await db.Brand.findAll({
        include: [{ model: db.Product, as: "ProductBrand" }],
        raw: false,
        nest: true,
      });
      resolve({ errCode: 0, errMessage: "Ok", brand });
    } catch (error) {
      reject(error);
    }
  });
};
let checkBrand = (brand) => {
  return new Promise(async (resolve, reject) => {
    try {
      let brandname = await db.Brand.findOne({
        where: { name: brand },
      });
      if (brandname) resolve(true);
      else resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};
let createBrand = (brand) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!brand.name) {
        resolve({
          errCode: 2,
          errMessage: "Missing Your Brand Name",
        });
      } else {
        let check = await checkBrand(brand.name);
        if (check) {
          resolve({
            errCode: 1,
            errMessage: "This brand already exists",
          });
        } else {
          await db.Brand.create({
            name: brand.name,
          });
          resolve({
            errCode: 0,
            errMessage: "add brand successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateBrand = (brand) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!brand.id) {
        resolve({
          errCode: 2,
          errMessage: "Can't find brand with id",
        });
      } else {
        let fbrand = await db.Brand.findOne({
          where: { id: brand.id },
          include: [{ model: db.Product, as: "ProductBrand" }],
          raw: false,
          nest: true,
        });
        let cbrand = await checkBrand(brand.name);
        if (cbrand) {
          resolve({
            errCode: 1,
            errMessage: "brand already exists",
          });
        } else {
          fbrand.name = brand.name;
          await fbrand.save();
          //delete brand old
          resolve({
            errCode: 0,
            errMessage: "brand have been updated successfully",
          });
        }
      }
    } catch (error) {
      console.log("Error");
      reject(error);
    }
  });
};
let deleteBrand = (brand_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let cbrand = await db.Brand.findOne({
        where: { id: brand_id },
        raw: false,
        nest: true,
      });
      if (!cbrand) {
        resolve({
          errCode: 1,
          errMessage: "Can't find your brand_id",
        });
      } else {
        let checkBrandhaveProduct = await db.Product.findOne({
          where: { brand_id: brand_id },
          raw: false,
          nest: true,
        });
        if (!checkBrandhaveProduct) {
          await db.Brand.destroy({
            where: { id: brand_id },
            nest: true,
            raw: false,
          });
          resolve({
            errCode: 0,
            errMessage: "Delete brand successfully",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Brand can't be deleted because is exists product",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createBrand,
  updateBrand,
  getAllBrand,
  deleteBrand,
};
