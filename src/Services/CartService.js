import db, { sequelize } from "../models/index";
// import bcrypt, { setRandomFallback } from "bcryptjs";
// import { raw } from "body-parser";
// import Product from "../models/Product";
// import Cartitem from "../models/Cartitem";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// var salt = bcrypt.genSaltSync(10);
// var cloudinary = require("cloudinary").v2;
let getAllCart = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Cart = await db.Cart.findAll({
        include: [
          {
            model: db.Product,
            as: "ProductItemInCart",
          },
        ],
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
      if (
        !data.cus_id ||
        !data.product_id ||
        !data.optionvalue ||
        !data.warehouse_id
      ) {
        resolve({
          errCode: 3,
          errMessage: "missing cus_id or option_id or product_id",
        });
      } else {
        let checkUser = await db.Customer.findOne({
          where: { id: data.cus_id },
        });
        let warehouse = await db.Warehouse.findOne({
          where: { id: data.warehouse_id },
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
                  optionvalue: data.optionvalue,
                  warehouse_id: data.warehouse_id,
                },
                attributes: ["optionvalue", "amount", "ttprice", "price", "id"],
                raw: false,
                nest: true,
              });
              if (checkCartitem) {
                let wa = await db.Warehouse_product.findOne({
                  where: {
                    product_id: data.product_id,
                    optionvalue: data.optionvalue,
                    warehouse_id: data.warehouse_id,
                  },
                  raw: false,
                  nest: true,
                });
                let ttt = checkCartitem.amount + data.amount;
                if (ttt > wa.quantity) {
                  resolve({
                    errCode: 6,
                    errMessage:
                      "S???n ph???m c???a b???n hi???n kh??ng ????? s??? l?????ng trong : " +
                      warehouse.name,
                  });
                } else {
                  console.log("wa: " + wa.id);
                  await sequelize.query(
                    'UPDATE "Cartitem" SET "amount" = :am , "ttprice" = :tt WHERE  "Cartitem"."id" = :op;',
                    {
                      replacements: {
                        am: checkCartitem.amount + data.amount,
                        tt:
                          checkCartitem.price *
                          (checkCartitem.amount + data.amount),
                        op: checkCartitem.id,
                      },
                      type: sequelize.UPDATE,
                      raw: false,
                      nest: true,
                    }
                  );
                  resolve({
                    errCode: 0,
                    errMessage: "Your Cartitem Have Update",
                  });
                }
              } else {
                console.log(data);
                let checkPOExist = true;
                let optionvalue = data.optionvalue;
                let optionsum = 0;
                await Promise.all(
                  optionvalue.map(async (item) => {
                    let checkPO = await db.Option_Product.findOne({
                      where: { id: item, product_id: data.product_id },
                    });
                    if (checkPO) {
                      optionsum = optionsum + checkPO.price;
                    } else {
                      reject({
                        errCode: 4,
                        errMessage:
                          "Your Option: " +
                          item +
                          " Not matching with product : " +
                          checkProduct.id,
                      });
                      // chi 1 thang loi => dung` chay ham
                      checkPOExist = false;
                    }
                  })
                );
                if (checkPOExist) {
                  let wa = await db.Warehouse_product.findOne({
                    where: {
                      product_id: data.product_id,
                      optionvalue: data.optionvalue,
                      warehouse_id: data.warehouse_id,
                    },
                    raw: false,
                    nest: true,
                  });
                  if (wa) {
                    if (wa.quantity < data.amount) {
                      resolve({
                        errCode: 6,
                        errMessage:
                          "S???n ph???m c???a b???n hi???n kh??ng ????? s??? l?????ng trong : " +
                          warehouse.name,
                      });
                    } else {
                      await db.Cartitem.create({
                        product_id: data.product_id,
                        amount: data.amount,
                        name: wa.name,
                        cart_id: checkCart.id,
                        optionvalue: data.optionvalue,
                        price: checkProduct.unitprice + optionsum,
                        ttprice:
                          (checkProduct.unitprice + optionsum) * data.amount,
                        warehouse_id: data.warehouse_id,
                      }).then(function (y) {
                        resolve({
                          errCode: -1,
                          errMessage: "Create cartitem by cart_id success",
                          cartitem: y.id,
                          cus: checkUser.id,
                        });
                      });
                    }
                  } else {
                    resolve({
                      errCode: 5,
                      errMessage: "Your Product Option not found in warehouse",
                    });
                  }
                }
              }
            } else {
              await db.Cart.create({
                cus_id: data.cus_id,
              }).then(async function (x) {
                if (x.id) {
                  let optionvalue = data.optionvalue;
                  let checkPOExist = true;
                  let optionsum = 0;
                  await Promise.all(
                    optionvalue.map(async (item) => {
                      console.log(item);
                      let checkPO = await db.Option_Product.findOne({
                        where: { id: item, product_id: data.product_id },
                      });
                      if (checkPO) {
                        optionsum = optionsum + checkPO.price;
                      } else {
                        reject({
                          errCode: 4,
                          errMessage:
                            "Your Option: " +
                            item +
                            " Not matching with product : " +
                            checkProduct.id,
                        });
                        // chi 1 thang loi => dung` chay ham
                        checkPOExist = false;
                      }
                    })
                  );
                  if (checkPOExist) {
                    let wa = await db.Warehouse_product.findOne({
                      where: {
                        product_id: data.product_id,
                        optionvalue: data.optionvalue,
                        warehouse_id: data.warehouse_id,
                      },
                      raw: false,
                      nest: true,
                    });
                    if (wa.quantity < data.amount) {
                      resolve({
                        errCode: 6,
                        errMessage:
                          "S???n ph???m c???a b???n hi???n kh??ng ????? s??? l?????ng trong : " +
                          warehouse.name,
                      });
                    } else {
                      await db.Cartitem.create({
                        name: wa.name,
                        product_id: data.product_id,
                        amount: 1,
                        cart_id: x.id,
                        optionvalue: data.optionvalue,
                        price: checkProduct.unitprice + optionsum,
                        ttprice: checkProduct.unitprice + optionsum,
                        warehouse_id: data.warehouse_id,
                      }).then(function (y) {
                        resolve({
                          errCode: -2,
                          errMessage:
                            "Create Cart And Create Cartitem Successfully",
                          customer: data.cus_id,
                        });
                      });
                    }
                  }
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
      }
    } catch (error) {
      reject(error);
    }
  });
};
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
//Cartitem.map(async (item) => {
// item.optionvalue.map(async (x) => {
let getCartByCustomer = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let cus = await db.Cart.findOne({
        where: { cus_id: id },
      });
      if (cus) {
        let cartitem = await db.Cartitem.findAll({
          where: { cart_id: cus.id },
          include: [
            {
              model: db.Product,
              as: "CartItemProduct",
              include: [
                { model: db.Brand, as: "ProductBrand", attributes: ["name"] },
                {
                  model: db.Category,
                  as: "CategoryProduct",
                  attributes: ["name"],
                },
              ],
            },
          ],
          order: ["id"],
          attributes: [
            "id",
            "name",
            "product_id",
            "amount",
            "price",
            "ttprice",
            "optionvalue",
            "cart_id",
            "warehouse_id",
          ],
          raw: false,
          plain: false,
          nest: true,
        });
        // const result = [
        //   ...cartitem
        //     .reduce((r, o) => {
        //       const key = o.id;
        //       const item =
        //         r.get(key) || Object.assign({}, o, { optionvalue: [] });
        //       item.optionvalue.push(o.CartItemProduct);
        //       return r.set(key, item);
        //     }, new Map())
        //     .values(),
        // ];
        // console.log(result);
        let quantity = await db.Cartitem.sum("amount", {
          where: { cart_id: cus.id },
          nest: true,
        });
        let totalprice = await db.Cartitem.sum("ttprice", {
          where: { cart_id: cus.id },
        });
        resolve({
          errCode: 0,
          errMessage: "Ok",
          cartitem,
          quantity,
          totalprice,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Your Cart not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateAmount = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Cart = await db.Cartitem.findOne({
        where: { id: data.id },
        raw: false,
        nest: true,
      });
      let ttprice = Cart.price * data.amount;
      if (Cart) {
        await sequelize.query(
          'UPDATE "Cartitem" SET "amount" = :ss, "ttprice" = :tt WHERE "Cartitem"."id" = :ff;',
          {
            replacements: { ff: data.id, ss: data.amount, tt: ttprice },
            type: sequelize.SELECT,
            nest: true,
            raw: false,
          }
        );
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
        where: { id: data.cart_id },
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
          let flash = true;
          let check = await db.Warehouse_product.findOne({
            where: {
              product_id: checkCart.product_id,
              optionvalue: checkCart.optionvalue,
            },
          });
          if (checkCart.amount >= check.quantity) {
            flash = false;
            resolve({
              errCode: 1,
              errMessage:
                "S??? l?????ng s???n ph???m trong kho ch??? c??n " +
                check.quantity +
                " s???n ph???m",
            });
          }
          if (flash) {
            await sequelize.query(
              'UPDATE "Cartitem" SET "amount" = :ss, "ttprice" = :tt WHERE "Cartitem"."id" = :ff;',
              {
                replacements: {
                  ff: data.cart_id,
                  ss: checkCart.amount + 1,
                  tt: (checkCart.ttprice =
                    checkCart.price * (checkCart.amount + 1)),
                },
                type: sequelize.SELECT,
                nest: true,
                raw: false,
              }
            );
            resolve({
              errCode: 0,
              errMessage: "Amount have been +1",
            });
          }
        }
        if (data.key == "-") {
          if (checkCart.amount == 1) {
            resolve({
              errCode: 2,
              errMessage: "Cannot minus more",
            });
          } else {
            await sequelize.query(
              'UPDATE "Cartitem" SET "amount" = :ss, "ttprice" = :tt WHERE "Cartitem"."id" = :ff;',
              {
                replacements: {
                  ff: data.cart_id,
                  ss: checkCart.amount - 1,
                  tt: (checkCart.ttprice =
                    checkCart.price * (checkCart.amount - 1)),
                },
                type: sequelize.SELECT,
                nest: true,
                raw: false,
              }
            );
            resolve({
              errCode: 0,
              errMessage: "Amount have been -1",
            });
          }
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
