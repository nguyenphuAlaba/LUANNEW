import db from "../models/index";
import bcrypt, { setRandomFallback } from "bcryptjs";
import { raw } from "body-parser";
import Product from "../models/Product";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;
let getAllCart = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Cart = await db.Cart.findAll({
        include: [{ model: db.Product, as: "ProductItemInCart" }],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "ok",
        Cart,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let addProductToCart = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkCart = await db.Cart.findOne({
        where: { cus_id: data.cus_id },
        raw: false,
        nest: true,
      });
      if (!checkCart) {
        let cUser = await db.Customer.findOne({
          where: { id: data.cus_id },
          raw: false,
          nest: true,
        });
        if (cUser) {
          await db.Cart.create({
            cus_id: data.cus_id,
          });
          let cCart = await db.Cart.findOne({
            where: { cus_id: data.cus_id },
            raw: false,
            nest: true,
          });
          if (cCart) {
            let chProduct = await db.Product.findOne({
              where: { id: data.product_id },
              raw: false,
              nest: true,
            });
            if (chProduct) {
              await db.Cartitem.create({
                product_id: data.product_id,
                amount: 1,
                cart_id: cCart.id,
              });
              resolve({
                errCode: 0,
                errMessage: "Add Cart Successfully",
              });
            } else {
              reject({
                errCode: 2,
                errMessage: "Your Product Not Found",
              });
            }
          }
        } else {
          reject({
            errCode: 1,
            errMessage: "Your Customer not exist",
          });
        }
      } else {
        let checkProduct = await db.Cartitem.findOne({
          where: { product_id: data.product_id },
          raw: false,
          nest: true,
        });
        if (!checkProduct) {
          let cp = await db.Product.findAll({
            where: { id: data.product_id },
            raw: false,
            nest: true,
          });
          if (cp) {
            await db.Cartitem.create({
              product_id: data.product_id,
              amount: 1,
              cart_id: checkCart.id,
            });
            resolve({
              errCode: -1,
              errMessage: "Add to cart successfully",
            });
          } else {
            reject({
              errCode: 3,
              errMessage: "Your Product not exist",
            });
          }
        } else {
          let Upcart = await db.Cartitem.findOne({
            where: { cart_id: checkCart.id, product_id: data.product_id },
            raw: false,
            nest: true,
          });
          Upcart.amount = Upcart.amount + 1;
          await Upcart.save();
          resolve({
            errCode: -2,
            errMessage: "Your Product has +1 amount",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getCartByCustomer = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let cart = await db.Cart.findOne({
        where: { cus_id: id },
        raw: true,
        nest: true,
      });
      //tinh bang ham
      // let Sum = await db.Cartitem.sum("amount", {
      //   where: { cart_id: cart.id },
      // });
      // tinh trong thuoc tinh
      // attributes: [
      //   "cart_id",
      //   [
      //     (db.Sequelize.fn("sum", db.Sequelize.col("amount")),
      //     "TotalQuantity"),
      //   ],
      // ],
      // group: ["cart_id"],
      let Cartitem = await db.Cartitem.findAll({
        where: { cart_id: cart.id },
        attributes: ["product_id", "amount"],
      });
      let Sum = await db.Cartitem.sum("amount", {
        where: { cart_id: cart.id },
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        cart,
        Cartitem,
        Sum,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let updateAmount = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Cart = await db.Cartitem.findOne({
        where: { cart_id: data.cart_id, product_id: data.product_id },
        raw: false,
        nest: true,
      });
      if (Cart) {
        Cart.amount = data.amount;
        Cart.save();
        resolve({
          errCode: 0,
          errMessage: "Update success",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Can't find Cartitem",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let plusMinusAmount = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkCart = await db.Cartitem.findOne({
        where: { cart_id: data.cart_id },
        raw: false,
        nest: true,
      });
      if (!checkCart) {
        resolve({
          errCode: 1,
          errMessage: "Can't find your cart",
        });
      } else {
        if (data.key == "+") {
          checkCart.amount = checkCart.amount + 1;
          await checkCart.save();
          resolve({
            errCode: 0,
            errMessage: "Amount have been +1",
          });
        }
        if (data.key == "-") {
          checkCart.amount = checkCart.amount - 1;
          await checkCart.save();
          resolve({
            errCode: 0,
            errMessage: "Amount have been -1",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  addProductToCart,
  getAllCart,
  updateAmount,
  getCartByCustomer,
  plusMinusAmount,
};
