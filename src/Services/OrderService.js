import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = await db.Order.findAll({
        include: [
          {
            model: db.Paymentmethod,
            as: "MethodOrder",
          },
          {
            model: db.User,
            as: "OrderUser",
          },
          {
            model: db.Voucher,
            as: "OrderVoucher",
          },
          {
            model: db.Orderitem,
            as: "orderItem",
          },
        ],
        raw: false,
        nest: true,
      });
      resolve(order);
    } catch (error) {
      reject(error);
    }
  });
};
let allOrderByStatus = (Order) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(Order);
      let worcher = await db.Order.findAll({
        where: { status: Order },
        raw: false,
        nest: true,
      });
      if (worcher) {
        resolve(worcher);
      } else {
        resolve({
          errCode: 1,
          errMessage: "Can't find status",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getCreateOrderByUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("userId ", data.user_id);
      let user = await db.User.findOne({
        where: { id: data.user_id },
      });
      console.log("userId ", user);
      if (user) {
        await db.User.create({
          fullname: data.fullname,
          email: data.email,
          status: data.status,
          Address: data.Address,
          phonenumber: data.phonenumber,
          voucher_id: 1,
          user_id: data.user_id,
        });
        resolve({
          errCode: 0,
          errMessage: "Create Order Successfully",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Your user not exists",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllOrderByUser = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("userId: " + user);
      let checkUser = await db.User.findOne({
        where: { id: user },
        raw: false,
        nest: true,
      });
      if (checkUser) {
        let findOrder = await db.Order.findAll({
          where: {
            user_id: user,
          },
          raw: false,
          nest: true,
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
          findOrder,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Your User is not exist",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllOrder,
  allOrderByStatus,
  getCreateOrderByUser,
  getAllOrderByUser,
};
