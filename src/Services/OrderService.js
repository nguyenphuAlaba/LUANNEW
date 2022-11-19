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
            model: db.Customer,
            as: "OrderUser",
          },
          {
            model: db.Voucher,
            as: "OrderVoucher",
          },
        ],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "OK",
        order,
      });
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
let getCreateOrderByUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkCart = await db.Cart.findOne({
        where: { cus_id: data.cus_id },
        raw: false,
        nest: true,
      });
      if (!checkCart) {
        resolve({
          errCode: 1,
          errMessage: "Cann't add to order because cart not found",
        });
      } else {
        await db.Order.create({
          fullname: data.fullname,
          email: data.email,
          status: 1,
          Address: data.Address,
          phonenumber: data.phonenumber,
          voucher_id: 1,
          method_id: 1,
          cus_id: 1,
        }).then(async function (x) {
          if (x.id) {
            let cartitem = data.cartitem;
            let listOrder = [];
            if (cartitem.length > 0) {
              await Promise.all(
                cartitem.map(async (item) => {
                  let Cart = await db.Cartitem.findOne({
                    where: { id: item },
                  });
                  let checkAmount = await db.Warehouse_product.findOne({
                    where: {
                      warehouse_id: data.warehouse_id,
                      product_id: Cart.product_id,
                    },
                    raw: false,
                    nest: true,
                  });
                  if (checkAmount.quantity > Cart.amount) {
                    let obj = {};
                    obj.order_id = x.id;
                    obj.product_id = 1;
                    obj.TotalQuantity = 1;
                    obj.price = 123;
                    listOrder.push(obj);
                  }
                })
              );
              db.Orderitem.bulkCreate(listOrder);
            }
          }
        });
        resolve({
          errCode: 0,
          errMessage: "Create Order Successfully",
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
      let checkUser = await db.Customer.findOne({
        where: { id: user },
        raw: false,
        nest: true,
      });
      if (checkUser) {
        let findOrder = await db.Order.findAll({
          where: {
            cus_id: user,
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
