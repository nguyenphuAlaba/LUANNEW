import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllWarranty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Warranty = await db.Warranty.findAll({
        include: [
          { model: db.Product, as: "ProductWarranty" },
          { model: db.Store, as: "StoreWarranty" },
        ],
        raw: false,
        nest: true,
      });
      resolve({
        Warranty,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let createWarranty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // infor: DataTypes.STRING,
      // description: DataTypes.STRING,
      // store_id: DataTypes.INTEGER,
      // product_id: DataTypes.INTEGER,
      // cus_id: DataTypes.INTEGER,
      // sta_id: DataTypes.INTEGER,
      let chCustomer = await db.Customer.findOne({
        where: { id: data.cus_id },
        raw: false,
        nest: true,
      });
      if (!chCustomer) {
        resolve({
          errCode: 1,
          errMessage: "Missing Customer ID",
        });
      } else {
        let chProduct = await db.Product.findOne({
          where: { id: data.product_id },
          raw: false,
          nest: true,
        });
        if (!chProduct) {
          resolve({
            errCode: 2,
            errMessage: "Missing Product ID",
          });
        } else {
          let checkStore = await db.Store.findOne({
            where: { id: data.store_id },
            raw: false,
            nest: true,
          });
          if (!checkStore) {
            resolve({
              errCode: 3,
              errMessage: "Missing Store ID",
            });
          } else {
            await db.Warranty.create({
              infor: data.infor,
              description: data.description,
              store_id: data.store_id,
              product_id: data.product_id,
              cus_id: data.cus_id,
              sta_id: data.sta_id,
            });
            resolve({
              errCode: 0,
              errMessage: "Has add Successfully",
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
// let updateWarranty = () => {
//   return new Promise(async (resolve, reject) => {

//   });
// };
module.exports = {
  getAllWarranty,
  createWarranty,
};
