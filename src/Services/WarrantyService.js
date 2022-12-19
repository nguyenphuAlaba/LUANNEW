import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
import moment from "moment";
var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllWarrantyProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Warranty = await db.Warranty.findAll({
        include: [
          {
            model: db.Warranty_info,
            as: "WarrantyInfor",
            where: { store_id: id },
          },
          // { model: db.Store, as: "StoreWarranty" },
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
        where: { code: { [Op.iLike]: data.orderCode } },
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
      let check = true;
      if (dateToday > expire) {
        check = false;
        resolve({
          errCode: 2,
          errMessage: "Your Warranty has expired",
        });
      }
      if (check) {
        let checkSeri = await db.Orderitem.findOne({
          where: { serinumber: data.serinumber },
          raw: false,
          nest: true,
        });
        if (!checkSeri) {
          resolve({
            errCode: 3,
            errMessage: "Your Serinumber is not exist",
          });
        } else {
          let sta = await db.Store_staff.findOne({
            where: { id: data.sta_id },
          });
          await db.Warranty_info.create({
            name: checkSeri.name,
            infor: data.infor,
            description: data.description,
            product_id: data.product_id,
            warranty_id: warranty.id,
            sta_id: sta.sta_id,
            store: sta.store_id,
          });
          resolve({
            errCode: 0,
            errMessage: "Your warranty has been created successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
// let update
// let updateWarranty = () => {
//   return new Promise(async (resolve, reject) => {

//   });
// };
module.exports = {
  getAllWarrantyProduct,
  createWarranty,
};
