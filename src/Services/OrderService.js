import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require("crypto");
const https = require("https");

//parameters
var partnerCode = "MOMO";
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var orderInfo = "pay with MoMo";

var redirectUrl = "http://localhost:3000/";

// var ipnUrl = "https://57ce-2402-800-6371-a14a-ed0d-ccd6-cbe9-5ced.ngrok.io/api/handle-order";

var notifyUrl = "https://fd5b-115-73-220-12.ap.ngrok.io/api/handle-order/";
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
          method_id: data.method_id,
          cus_id: data.cus_id,
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
                  let warehouse = await db.Warehouse.findOne({
                    where: { id: data.warehouse_id },
                  });
                  let product = await db.Product.findOne({
                    where: {
                      id: Cart.product_id,
                    },
                    raw: false,
                  });
                  if (checkAmount.quantity > Cart.amount) {
                    let obj = {};
                    obj.order_id = x.id;
                    obj.product_id = product.id;
                    obj.TotalQuantity = Cart.amount;
                    obj.price = product.unitprice;
                    listOrder.push(obj);
                  } else {
                    resolve({
                      errCode: 2,
                      errMessage:
                        "Product : " +
                        product.name +
                        " in Warehouse : " +
                        warehouse.name +
                        " Are Not enough quantity ",
                    });
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
