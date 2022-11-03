import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let createOption = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkOption = await db.Option.findOne({
        where: { name: data.name },
        raw: false,
        nest: true,
      });
      if (checkOption) {
        resolve({
          errCode: 1,
          errMessage: "Your Option has already exists",
        });
      } else {
        await db.Option.create({
          name: data.name,
        });
        resolve({
          errCode: 0,
          errMessage: "Your Option has been add successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteOption = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(id);
      let checkOption = await db.Option.findAll({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (!checkOption) {
        resolve({
          errCode: 1,
          errMessage: "Couldn't find your id Option",
        });
      } else {
        let checkOptionProduct = await db.Option_Product.findOne({
          where: { option_id: id },
          raw: false,
          nest: true,
        });
        if (checkOptionProduct) {
          resolve({
            errCode: 2,
            errMessage: "Can't delete your Option",
          });
        } else {
          await db.Option.destroy({
            where: { id: id },
            raw: false,
            nest: true,
          });
          resolve({
            errCode: 0,
            errMessage: "Your Option has been deleted",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let createOptionProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let COption = await db.Option.findOne({
        where: {
          id: data.option_id,
        },
        raw: false,
        nest: true,
      });
      if (COption) {
        let Option = await db.Option_Product.findOne({
          where: {
            name: data.name,
            product_id: data.product_id,
            option_id: data.option_id,
          },
          raw: false,
          nest: true,
        });
        if (Option) {
          resolve({
            errCode: 1,
            errMessage: "Your Option has been exists ",
          });
        } else {
          await db.Option_Product.create({
            name: data.name,
            price: data.price,
            quantity: data.quantity,
            product_id: data.product_id,
            option_id: data.option_id,
          });
          resolve({
            errCode: 0,
            errMessage: "Add option Successfully",
          });
        }
      } else {
        resolve({
          errCode: 2,
          errMessage: "Cann't find your option",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteOptionPrpduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Option = await db.Option_Product.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (!Option) {
        resolve({
          errCode: 1,
          errMessage: "Cann't find your option",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getOptionByProductId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find Product ID",
        });
      } else {
        console.log(id);
        let Option = await db.Option_Product.findAll({
          where: { product_id: id },
          raw: false,
          nest: true,
        });
        resolve({
          errCode: 0,
          errMessage: "ok",
          Option,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createOption,
  deleteOption,
  createOptionProduct,
  deleteOptionPrpduct,
  getOptionByProductId,
};
