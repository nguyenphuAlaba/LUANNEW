import db from "../models/index";
import bcrypt, { setRandomFallback } from "bcryptjs";
import { raw } from "body-parser";
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
        where: { id: data.cus_id },
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
              errCode: 0,
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
            errCode: 0,
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
      let cart = await db.Cartitem.findAll({
        where: { cart_id: id },
        raw: true,
        nest: true,
      });
      // attributes: [
      //   [db.Sequelize.fn("sum", db.Sequelize.col("amount")), "total_amount"],
      // ],
      let Sum = await db.Cartitem.sum("amount", { where: { cart_id: id } });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        cart,
        Sum,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  addProductToCart,
  getAllCart,
  getCartByCustomer,
};
