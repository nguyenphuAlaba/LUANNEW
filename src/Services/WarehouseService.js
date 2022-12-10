import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllWarehouse = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // let Warehouse = await db.Warehouse.findAll({
      //   // include: [{ model: db.Staff, as: "WarehouseStaff" }],
      //   raw: false,
      //   nest: true,
      // });
      let Warehouse = await db.Warehouse.findAll({
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "Warehouse get success",
        Warehouse,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let createWarehouse = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data);
      let CWarehouse = await db.Warehouse.findOne({
        where: { name: data.name },
        raw: false,
        nest: true,
      });
      if (CWarehouse) {
        resolve({
          errCode: 1,
          errMessage: "Warehouse already exists",
        });
      } else {
        await db.Warehouse.create({
          address: data.address,
          name: data.name,
        });
        resolve({
          errCode: 0,
          errMessage: "create Warehouse successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateWarehouse = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let cwarehouse = await db.Warehouse.findOne({
        where: { id: data.id },
        raw: false,
        nest: true,
      });
      if (!cwarehouse) {
        resolve({
          errCode: 1,
          errMessage: "Your warehouse is not exists",
        });
      } else {
        cwarehouse.name = data.name;
        cwarehouse.address = data.address;
        cwarehouse.save();
        resolve({
          errCode: 0,
          errMessage: "Update Warehouse Successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteWarehouse = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let warehouse = await db.Warehouse.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (!warehouse) {
        resolve({
          errCode: 1,
          errMessage: "Cann't find your warehouse_id",
        });
      } else {
        let cwarehouse = await db.Warehouse_staff.findOne({
          where: { warehouse_id: id },
          raw: false,
          nest: true,
        });
        if (cwarehouse) {
          resolve({
            errCode: 2,
            errMessage: "Your warehouse has User cannot Delete",
          });
        } else {
          await db.Warehouse.destroy({
            where: {
              id: id,
            },
          });
          resolve({
            errCode: 0,
            errMessage: "Delete warehouse successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllProductInWarehouse = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Warehouse_product.findAll({
        where: { warehouse_id: id },
        attributes: [
          "id",
          "name",
          "quantity",
          "warehouse_id",
          "product_id",
          "quantity",
          "optionvalue",
        ],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "OK",
        product,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getAllWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getAllProductInWarehouse,
};
