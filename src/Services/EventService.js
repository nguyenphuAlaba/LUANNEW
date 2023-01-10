import db from "../models/index";
// import bcrypt from "bcryptjs";
// import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var cron = require("node-cron");
import moment from "moment";
import emailService from "./emailService";
// var salt = bcrypt.genSaltSync(10);
// var cloudinary = require("cloudinary").v2;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
// * * * * * * là Mỗi giây
// * 6 * * * là chạy vào lúc 6h AM mỗi ngày
//sinh nhat
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
let updateEvent = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let event = await db.Event.findOne({
        where: { id: data.id },
        raw: false,
        nest: true,
      });
      if (!event) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find your event",
        });
      } else {
        if (!data.name) {
          data.name = event.name;
        }
        var datestart = moment(new Date(data.datestart)).format("YYYY-MM-DD");
        var dateend = moment(new Date(data.dateend)).format("YYYY-MM-DD");
        event.datestart = datestart;
        event.dateend = dateend;
        event.name = data.name;
        await event.save();
        resolve({
          errCode: 0,
          errMessage: "Update Successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteEvent = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let event = await db.Event.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (!event) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find your event",
        });
      } else {
        await db.Event.destroy({
          where: { id: id },
          raw: false,
          nest: true,
        });
        resolve({
          errCode: 0,
          errMessage: "Delete Event Successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllEvent = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let event = await db.Event.findAll({
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        event,
      });
    } catch (error) {
      reject(error);
    }
  });
};
// * * * * * * là Mỗi giây
// * 6 * * * là chạy vào lúc 6h AM mỗi ngày
var quest = cron.schedule("* 6 * * *", async () => {
  var dateToday = moment(new Date()).format("MM-DD");
  let event = await db.Event.findOne({
    where: {
      [Op.and]: [
        db.sequelize.where(
          db.sequelize.cast(db.sequelize.col("Event.datestart"), "varchar"),
          { [Op.iLike]: `%${dateToday}%` }
        ),
      ],
    },
    raw: false,
    nest: true,
  });
  let cusz = await db.Customer.findAll();
  if (cusz && cusz.length > 0) {
    let discount = 5;
    let codegif = "PTSE" + getRandomInt(10000);
    await db.Voucher.create({
      code: codegif,
      name: event.name,
      sale: discount,
      expire: "2022/12/17",
      event_id: 1,
      maxuse: 600,
    });
    let listmail = [];
    await Promise.all(
      cusz.map(async (x) => {
        console.log(x.id);
        let dataSend = {};
        dataSend.name = event.name;
        dataSend.email = x.email;
        dataSend.data = { codeE: codegif, disco: discount };
        emailService.sendEmailVoucherEvent(dataSend);
      })
    );
  }
});
quest.start();
module.exports = {
  getRandomInt,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvent,
};
