import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var cron = require("node-cron");
import moment from "moment";
import emailService from "./emailService";
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

var task = cron.schedule("* 6 * * *", async () => {
  var dateToday = moment(new Date()).format("MM-DD");
  let cus = await db.Customer.findAll({
    where: {
      [Op.and]: [
        db.sequelize.where(
          db.sequelize.cast(db.sequelize.col("Customer.birthday"), "varchar"),
          { [Op.iLike]: `%${dateToday}%` }
        ),
        { isActive: true },
      ],
    },
  });
  if (cus && cus.length > 0) {
    let mailist = [];
    await Promise.all(
      cus.map(async (x) => {
        let ccus = await db.Customer.findOne({
          where: { id: x.id },
          raw: false,
          nest: true,
        });
        let discount = 10;
        let codegif = "PTS" + getRandomInt(10000);
        await db.Voucher.create({
          code: codegif,
          name: "Phú Thắng phiếu giảm giá SINH NHẬT" + ccus.fullname,
          sale: discount,
          expire: null,
          event_id: 1,
          maxuse: 1,
        });
        let obj = {};
        obj.email = ccus.email;
        obj.data = { gifCode: codegif, discoutNumber: discount };
        mailist.push(obj);
      })
    );
    emailService.sendEmailVoucherGif(mailist);
  }
});

task.start();
module.exports = {
  getRandomInt,
  createEvent,
};
