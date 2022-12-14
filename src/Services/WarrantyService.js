import db, { sequelize } from "../models/index";
// import bcrypt from "bcryptjs";
// import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
import moment from "moment";
// var salt = bcrypt.genSaltSync(10);
// var cloudinary = require("cloudinary").v2;

let getAllWarrantyProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Warranty = await db.Warranty.findAll({
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
        where: { order_id: data.order_id },
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
            where: { sta_id: data.sta_id },
          });
          if (!sta) {
            resolve({
              errCode: 4,
              errMessage: "Couldn't find Staff",
            });
          } else {
            await db.Warranty_info.create({
              name: checkSeri.name,
              infor: data.infor,
              description: data.description,
              product_id: checkSeri.product_id,
              warranty_id: warranty.id,
              serinumber: data.serinumber,
              sta_id: sta.sta_id,
              store_id: sta.store_id,
            });
            resolve({
              errCode: 0,
              errMessage: "Your warranty has been created successfully",
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateWarranty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let warranty = await db.Warranty_info.findOne({
        where: { id: data.id },
      });
      if (!warranty) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find your Warranty",
        });
      } else {
        if (!data.name) {
          data.name = warranty.name;
        }
        if (!data.infor) {
          data.infor = warranty.infor;
        }
        if (!data.description) {
          data.description = warranty.description;
        }
        await sequelize.query(
          'UPDATE "Warranty_info" SET "name" = :na, "infor" = :in, "description" = :des WHERE "Warranty_info"."id" = :waid;',
          {
            replacements: {
              waid: data.id,
              na: data.name,
              des: data.description,
              in: data.infor,
            },
            type: sequelize.UPDATE,
            raw: false,
            nest: true,
          }
        );
        resolve({
          errCode: 0,
          errMessage: "Update successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let warrantyByCus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(id);
      let warranty = await db.Warranty.findAll({
        where: { cus_id: id },
        raw: true,
        nest: false,
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        warranty,
      });
      if (!warranty) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find warranty",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailWarranty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let warranty = await db.Warranty.findOne({
        where: { id: id },
        include: [
          { model: db.Warranty_info, as: "WarrantyInfor" },
          // { model: db.Order, as: "OrderWarranty" },
        ],
        raw: false,
        nest: true,
      });
      if (!warranty) {
        resolve({
          errCode: 1,
          errMessage: "Warranty not found",
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Ok",
        warranty,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getAllStore = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let store = await db.Store.findAll({
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "OK",
        store,
      });
      if (!store) {
        resolve({
          errCode: 1,
          errMessage: "Store not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getwarrantyInfor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(id);
      let warranty = await db.Warranty_info.findAll({
        where: { store_id: id },
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        warranty,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllWarrantyProduct,
  createWarranty,
  updateWarranty,
  warrantyByCus,
  getAllStore,
  getDetailWarranty,
  getwarrantyInfor,
};
