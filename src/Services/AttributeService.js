import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let createAtribute = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data) {
        let checkProduct = await db.Product.findAll({
          where: { id: data.product_id },
          raw: false,
          nest: true,
        });
        if (checkProduct) {
          let checkAttribute = await db.Attribute.findOne({
            where: { name: data.name, product_id: data.product_id },
            raw: false,
            nest: true,
          });
          if (checkAttribute) {
            resolve({
              errCode: 1,
              errMessage: "Your Attribute has already been",
            });
          } else {
            await db.Attribute.create({
              name: data.name,
              product_id: data.product_id,
            });
            resolve({
              errCode: 0,
              errMessage: "Attribute has been created",
            });
          }
        } else {
          resolve({
            errCode: 2,
            errMessage: "Cann't find your product",
          });
        }
      } else {
        resolve({
          errCode: 3,
          errMessage: "Missing required attribute",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateAttribute = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data) {
        let attribute = await db.Attribute.findOne({
          where: { id: data.id },
          raw: false,
          nest: true,
        });
        if (attribute) {
          if (attribute.name == data.name) {
            resolve({
              errCode: 1,
              errMessage: "Your attribute name is already exists",
            });
          } else {
            attribute.name = data.name;
            attribute.save();
            resolve({
              errCode: 0,
              errorMessage: "Your attribute have been updated",
            });
          }
        } else {
          resolve({
            errCode: 2,
            errorMessage: "Missing required attribute",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteAttribute = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("diaci: ", id);
      let attribute = await db.Attribute.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (!attribute) {
        resolve({
          errCode: 1,
          errMessage: "Attribute not found",
        });
      } else {
        let checkOption = await db.Option.findOne({
          where: { attribute_id: id },
          raw: false,
          nest: true,
        });
        if (checkOption) {
          resolve({
            errCode: 2,
            errMessage: "Cann't delete Attribute because exists Option",
          });
        } else {
          await db.Attribute.destroy({
            where: { id: id },
          });
          resolve({
            errCode: 0,
            errMessage: "Attribute has been deleted",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createAtribute,
  updateAttribute,
  deleteAttribute,
};
