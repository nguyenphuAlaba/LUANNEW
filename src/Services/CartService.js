import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let addProductToCart = (data) =>{
  return new Promise(async (resolve, reject) => {
    try{

    }
    catch(error){

    }
  }
}
module.exports = {};
