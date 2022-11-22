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
      let checkUser = await db.Customer.findOne({
        where: { id: data.cus_id },
      });
      if (checkUser) {
        let checkProduct = await db.Product.findOne({
          where: { id: data.product_id },
        });
        if (checkProduct) {
          let checkCart = await db.Cart.findOne({
            where: { cus_id: data.cus_id },
          });
          if (checkCart) {
            let checkCartitem = await db.Cartitem.findOne({
              where: {
                cart_id: checkCart.id,
                product_id: data.product_id,
              },
              raw: false,
              nest: true,
            });
            if (checkCartitem) {
              checkCartitem.amount = checkCartitem.amount + 1;
              await checkCartitem.save();
              resolve({
                errCode: 0,
                errMessage: "+1 Amount" + data.product_id + "Successfully",
              });
            } else {
              await db.Cartitem.create({
                product_id: data.product_id,
                amount: 1,
                cart_id: checkCart.id,
              });
              resolve({
                errCode: -1,
                errMessage: "Create cartitem by cart_id success",
              });
            }
          } else {
            await db.Cart.create({
              cus_id: data.cus_id,
            }).then(async function (x) {
              if (x.id) {
                await db.Cartitem.create({
                  product_id: data.product_id,
                  amount: 1,
                  cart_id: x.id,
                });
                resolve({
                  errCode: -2,
                  errMessage: "Create Cart And Create Cartitem Successfully",
                });
              }
            });
          }
        } else {
          resolve({
            errCode: 1,
            errMessage: "Product not found",
          });
        }
      } else {
        resolve({
          errCode: 2,
          errMessage: "Customer not found",
        });
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
let deleteCartitem = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkCartitem = await db.Cartitem.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (checkCartitem) {
        await db.Cartitem.destroy({
          where: { id: id },
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Can't find cart item",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteAllCartitem = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkCartitem = await db.Cartitem.findOne({
        where: { cart_id: id },
        raw: false,
        nest: true,
      });
      if (checkCartitem) {
        await db.Cartitem.destroy({
          where: { cart_id: id },
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Can't find cart item",
        });
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
  deleteCartitem,
  deleteAllCartitem,
};
