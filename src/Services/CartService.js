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
        where: { id: data.cart_id },
        raw: false,
        nest: true,
      });
      if (!checkCart) {
        await db.Cart.create({
          cus_id: data.cus_id,
        });
        let cCart = await db.Cart.findOne({
          where: { cus_id: data.cus_id },
          raw: false,
          nest: true,
        });
        if (cCart) {
          await db.Cartitem.create({
            product_id: data.product_id,
            amount: 1,
            cart_id: data.cart_id,
          });
          resolve({
            errCode: 0,
            errMessage: "Add Cart Successfully",
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
              cart_id: data.cart_id,
            });
            resolve({
              errCode: -1,
              errMessage: "Add to cart successfully",
            });
          } else {
            reject({
              errCode: 1,
              errMessage: "Your Product not exist",
            });
          }
        } else {
          let Upcart = await db.Cartitem.findOne({
            where: { cart_id: data.cart_id, product_id: data.product_id },
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
module.exports = {
  addProductToCart,
  getAllCart,
};
