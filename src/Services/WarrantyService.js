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
      console.log("aaaaaaa");
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
module.exports = {
  getAllWarranty,
};
