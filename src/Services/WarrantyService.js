import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
import moment from "moment";
var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllWarranty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Warranty = await db.Warranty.findAll({
        where: { store_id: id },
        include: [
          { model: db.Warranty_info, as: "WarrantyInfor" },
          { model: db.Store, as: "StoreWarranty" },
          { model: db.Order, as: "OrderWarranty" },
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
      var dateToday = moment(new Date()).format("YYYY-MM-DD");
      let warranty = await db.Warranty.findOne({
        where: { id: data.warranty_id },
        raw: false,
        nest: true,
      });
      let warrantyinfo = await db.Warranty_info.findOne({
        where: { warranty_id: data.warranty_id },
        raw: false,
        nest: true,
      });
      if (!warranty) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find Warranty",
        });
      }
      var expire = moment(new Date(warranty.expire)).format("YYYY-MM-DD");
      if (expire > dateToday) {
        console.log("aaaaaaaaaaaaaaaaaa");
      }
      console.log(warranty.expire);
      console.log(dateToday);
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
