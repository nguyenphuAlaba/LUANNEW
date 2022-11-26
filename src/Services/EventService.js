import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let createEvent = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name) {
        resolve({
          errCode: 1,
          errMessage: "Missing Event Name",
        });
      } else {
        let event = await db.Event.findOne({
          where: { name: data.name },
        });
        if (event) {
          resolve({
            errCode: 1,
            errMessage: "Your event has exist",
          });
        } else {
          await db.Event.create({
            name: data.name,
            datestart: data.datestart,
            dateend: data.dateend,
          });
          resolve({
            errCode: 0,
            errMessage: "Your Event Create Successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
module.exports = {
  getRandomInt,
  createEvent,
};
