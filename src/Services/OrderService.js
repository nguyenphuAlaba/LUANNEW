import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
import { ifError } from "assert";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require("crypto");
const https = require("https");
import emailService from "./emailService";
//parameters
var partnerCode = "MOMO";
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var orderInfo = "pay with MoMo";

var redirectUrl = "http://localhost:3000/";

// var ipnUrl = "https://57ce-2402-800-6371-a14a-ed0d-ccd6-cbe9-5ced.ngrok.io/api/handle-order";

var notifyUrl =
  "https://8bae-2402-800-6314-f0b4-89e-f4a6-f896-d234.ap.ngrok.io/api/handle-order/";
// var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
var requestType = "captureWallet";

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
      let checkCus = await db.Customer.findOne({
        where: { id: data.cus_id },
      });
      let checkware = await db.Warehouse.findOne({
        where: { id: data.warehouse_id },
        raw: false,
        nest: true,
      });
      if (!checkCus || !checkware) {
        resolve({
          errCode: 1,
          errMessage: "Missing require",
        });
      }
      let check = true;
      let cartitem = data.cartitem;
      await Promise.all(
        cartitem.map(async (x) => {
          let cart = await db.Cartitem.findOne({
            where: { id: x },
            raw: false,
            nest: true,
          });
          if (!cart) {
            resolve({
              errCode: 1,
              errMessage: "Cart not found",
            });
          }
          let option = cart.optionvalue;
          let list = [];
          await Promise.all(
            option.map(async (item) => {
              list.push(item);
              let checkOp = await db.Option_Product.findOne({
                where: { id: item },
              });
              if (checkOp) {
                let checkAmount = await db.Warehouse_product.findOne({
                  where: { optionvalue: option },
                });
                if (!checkAmount) {
                  resolve({
                    errCode: 3,
                    errMessage: "Cannot find your Product In warehouse",
                  });
                }
                if (checkAmount.quantity < cart.amount) {
                  console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
                  check = false;
                  resolve({
                    errCode: 2,
                    errMessage: "Your Option Not enough quantity",
                  });
                }
              }
            })
          );
        })
      );
      if (check) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
        await db.Order.create({
          fullname: data.fullname,
          email: data.email,
          status: 1,
          Address: data.Address,
          phonenumber: data.phonenumber,
          voucher_id: 1,
          method_id: data.method_id,
          cus_id: data.cus_id,
          warehouse_id: data.warehouse_id,
          paymentstatus: 1,
        }).then(async function (x) {
          if (x.id) {
            let listOT = [];
            let op = data.cartitem;
            await Promise.all(
              op.map(async (o) => {
                let cc = await db.Cartitem.findOne({
                  where: { id: o },
                });
                let pp = {};
                pp.order_id = x.id;
                pp.product_id = cc.product_id;
                pp.amount = cc.amount;
                pp.cart_id = cc.cart_id;
                pp.price = cc.price;
                pp.optionValues = cc.optionvalue;
                pp.TotalQuantity = cc.amount;
                pp.TotalPrice = cc.ttprice;
                listOT.push(pp);
              })
            );
            await db.Orderitem.bulkCreate(listOT);
            let cc = data.cartitem;
            await Promise.all(
              cc.map(async (dcart) => {
                await db.Cartitem.destroy({
                  where: { id: dcart },
                });
              })
            );
            let order = await db.Order.findOne({
              where: { id: x.id },
              raw: false,
              nest: true,
            });
            let sump = await db.Orderitem.sum("TotalPrice", {
              where: { order_id: order.id },
            });
            let sumq = await db.Orderitem.sum("TotalQuantity", {
              where: { order_id: order.id },
            });
            let dataSend = {
              orderCus: order.id,
              nameCus: order.fullname,
              addressCus: order.Address,
              phonenumberCus: order.phonenumber,
              paymentstatus: order.paymentstatus,
              email: order.email,
              ttp: sump,
              ttq: sumq,
            };
            let dataarray = [];
            await Promise.all(
              listOT.map(async (item) => {
                let pro = await db.Warehouse_product.findOne({
                  where: {
                    product_id: item.product_id,
                    optionvalue: item.optionValues,
                  },
                  raw: false,
                  nest: true,
                });
                let obj = {};
                obj.proid = item.order_id;
                obj.name = pro.name;
                obj.price = item.price;
                obj.quantity = item.amount;
                obj.TotalPrice = item.TotalPrice;
                dataarray.push(obj);
              })
            );
            console.log(dataarray);
            emailService.sendSimpleEmail(dataSend, dataarray);
          }
        });
        resolve({
          errCode: 0,
          errMessage: "Create Order successfully",
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
let deleteOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkOrder = await db.Order.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (checkOrder) {
        if (checkOrder.status == 1 || checkOrder.status == 2) {
          await db.Orderitem.destroy({
            where: { order_id: id },
          }).then(
            await db.Order.destroy({
              where: { id: id },
            })
          );
          resolve({
            errCode: 0,
            errMessage: "Your order has been deleted",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage:
              "You Cannot Delete Your Order Because it has been delivery",
          });
        }
      } else {
        resolve({
          errCode: 2,
          errMessage: "Oder not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getMomoPaymentLink = async (req) => {
  var requestId = partnerCode + new Date().getTime();
  var orderId = requestId;
  let fOrder = await db.Orderitem.sum("TotalPrice", {
    where: { order_id: req.body.orderId },
    nest: true,
  });
  let order = await db.Order.findOne({
    where: {
      id: req.body.orderId,
    },
  });
  req.body.amount = fOrder;
  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    req.body.amount +
    "&extraData=" +
    req.body.orderId +
    "&ipnUrl=" +
    notifyUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  //console.log("--------------------RAW SIGNATURE----------------");
  console.log("rawSignature: ", rawSignature);
  //signature
  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");
  //console.log("--------------------SIGNATURE----------------");
  console.log("signature: ", signature);
  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: req.body.amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: notifyUrl,
    extraData: req.body.orderId,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });

  console.log("requestBody: ", requestBody);

  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    // const req = https.request(options, (res) => {
    //   console.log(`Status: ${res.statusCode}`);
    //   console.log(`Headers: ${JSON.stringify(res.headers)}`);
    //   res.setEncoding("utf8");
    //   res.on("data", (body) => {
    //     console.log("Body: ");
    //     console.log(body);
    //     console.log("payUrl: ");
    //     console.log(JSON.parse(body).payUrl);
    //     resolve(JSON.parse(body));
    //   });
    //   res.on("end", () => {
    //     console.log("No more data in response.");
    //     // var post_req = https.request(options2, function (res) {
    //     //   res.setEncoding('utf8');
    //     //   res.on('data', function (chunk) {
    //     //     console.log('Response: ' + chunk);
    //     //   });
    //     // });
    //     // // post the data
    //     // post_req.write(requestBody);
    //     // post_req.end();
    //   });
    // });

    const req = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      res.setEncoding("utf8");
      res.on("data", (body) => {
        console.log("Body: ");
        console.log(body);
        // console.log("payUrl: ");
        // console.log(JSON.parse(body).payUrl);
        // resolve(body)
        try {
          const a = JSON.parse(body);
          resolve(a);
        } catch (e) {
          console.log(e);
          var lastChar = body.substr(body.length - 1);
          console.log("lastChar: ", lastChar);
          if (lastChar !== "}") body = body + "}";
          resolve(body);
        }
        // resolve(JSON.parse(body));
      });
      res.on("end", () => {
        console.log("No more data in response.");
        // var post_req = https.request(options2, function (res) {
        //   res.setEncoding('utf8');
        //   res.on('data', function (chunk) {
        //     console.log('Response: ' + chunk);
        //   });
        // });
        // // post the data
        // post_req.write(requestBody);
        // post_req.end();
      });
    });
    req.on("error", (e) => {
      // console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    console.log("Sending....");

    req.write(requestBody);
    req.end();
  });
};

// Update status order //
let handleOrderPayment = async (req) => {
  console.log("Check order: ", req.body);
  if (req.body.resultCode == 0) {
    // req.body.extraData = "285";
    const orderCurrent = await db.Order.findOne({
      where: { id: req.body.extraData },
      raw: false,
      nest: true,
    });
    const orderCurrentData = orderCurrent.dataValues;
    console.log("orderCurrentData dataValues: ", orderCurrentData);
    orderCurrentData.paymentstatus = 2;
    const result = await db.Order.update(orderCurrentData, {
      where: { id: req.body.extraData },
      returning: true,
      plain: true,
    });
    // console.log(result);
    return result;
  }
  return false;
};

module.exports = {
  getAllOrder,
  allOrderByStatus,
  getCreateOrderByUser,
  getAllOrderByUser,
  deleteOrder,
  getMomoPaymentLink,
  handleOrderPayment,
};
