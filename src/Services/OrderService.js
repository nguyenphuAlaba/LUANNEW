import db, { sequelize } from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
import { ifError } from "assert";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require("crypto");
const https = require("https");
import emailService from "./emailService";
import moment from "moment";
import { totalmem } from "os";
import { resolve } from "path";
//parameters
var partnerCode = "MOMO";
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var orderInfo = "pay with MoMo";

var redirectUrl = "http://localhost:3000/";

// var ipnUrl = "https://57ce-2402-800-6371-a14a-ed0d-ccd6-cbe9-5ced.ngrok.io/api/handle-order";

var notifyUrl =
  "https://b89a-2402-800-6314-b7c1-8cbb-eea4-fb94-9689.ap.ngrok.io/api/handle-order/";
// var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
var requestType = "captureWallet";

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
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
let getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Order = await db.Order.findOne({
        where: { id: id },
        include: [
          {
            model: db.Product,
            as: "OrderProductItem",
            through: {
              attributes: [
                "id",
                "serinumber",
                "name",
                "product_id",
                "price",
                "order_id",
                "TotalQuantity",
                "optionValues",
                "TotalPrice",
              ],
            },
          },
        ],
        raw: true,
        plain: false,
        nest: true,
      });
      const result = [
        ...Order.reduce((r, o) => {
          const key = o.id;
          console.log(" Check O : " + o);
          const item = r.get(key) || Object.assign({}, o, { listOrder: [] });
          item.listOrder.push(o.OrderProductItem);
          return r.set(key, item);
        }, new Map()).values(),
      ];
      let Arr = result[0];
      const net = [
        ...Arr.listOrder
          .reduce((r, o) => {
            const key = o.id;
            console.log(" Check O : " + o);
            const item =
              r.get(key) ||
              Object.assign({}, o, {
                values: [],
              });
            item.values.push(o.Orderitem);
            console.log(item.values);
            delete item.Orderitem;
            return r.set(key, item);
          }, new Map())
          .values(),
      ];
      let obj = {
        ...Arr,
        Order: net,
        // quantity: resultQuantity,
      };
      delete obj.OrderProductItem;
      delete obj.Orderitem;
      delete obj.Order;
      resolve({
        errCode: 0,
        errMessage: "Ok",
        data: obj,
      });
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
        let year = moment(new Date()).format("YYYY");
        let month = moment(new Date()).format("MM");
        let day = moment(new Date()).format("DD");
        let codeor = "O3D3R" + year + month + day + getRandomInt(10000);
        await db.Order.create({
          code: codeor,
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
                for (let i = 0; i < cc.amount; i++) {
                  let seri = "TPS" + year + month + day + getRandomInt(10000);
                  let pp = {};
                  pp.serinumber = seri;
                  pp.order_id = x.id;
                  pp.name = cc.name;
                  pp.product_id = cc.product_id;
                  pp.amount = cc.amount;
                  pp.cart_id = cc.cart_id;
                  pp.price = cc.price;
                  pp.optionValues = cc.optionvalue;
                  pp.TotalQuantity = 1;
                  pp.TotalPrice = cc.ttprice;
                  listOT.push(pp);
                  let checkAmount = await db.Warehouse_product.findOne({
                    where: {
                      product_id: cc.product_id,
                      optionvalue: cc.optionvalue,
                      warehouse_id: data.warehouse_id,
                    },
                    attributes: [
                      "id",
                      "name",
                      "product_id",
                      "quantity",
                      "warehouse_id",
                    ],
                    raw: false,
                    nest: true,
                  });
                  await sequelize.query(
                    'UPDATE "Warehouse_product" SET "quantity" = :qa WHERE "Warehouse_product"."id" = :pr;',
                    {
                      replacements: {
                        pr: checkAmount.id,
                        qa: checkAmount.quantity - cc.amount,
                      },
                      type: Sequelize.UPDATE,
                      raw: false,
                      nest: true,
                    }
                  );
                  let sumtll = await db.Warehouse_product.sum("quantity", {
                    where: { product_id: cc.product_id },
                  });
                  if (sumtll > 0) {
                    await db.Product.update(
                      { currentQuantity: sumtll },
                      { where: { id: cc.product_id } }
                    );
                  }
                  if (sumtll == 0) {
                    await db.Product.update(
                      { status: 2 },
                      { where: { id: cc.product_id } }
                    );
                  }
                }
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
              code: codeor,
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
                obj.code = item.serinumber;
                obj.proid = item.order_id;
                obj.name = pro.name;
                obj.price = item.price;
                obj.quantity = 1;
                obj.TotalPrice = item.TotalPrice;
                dataarray.push(obj);
              })
            );
            emailService.sendSimpleEmail(dataSend, dataarray);
            resolve({
              errCode: 0,
              errMessage: "Create Order: " + x.id + " successfully",
              Orderid: x.id,
            });
          }
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
          include: [{ model: db.Product, as: "OrderProductItem" }],
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
let cancelOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Order = await db.Order.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (Order) {
        if (Order.status == 1 || Order.status == 2) {
          Order.status = 5;
          await Order.save();
          resolve({
            errCode: 0,
            errMessage: "Your Order has cancel",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "You cannot cancel this Order",
          });
        }
      } else {
        resolve({
          errCode: 2,
          errMessage: "Cannot find your Order",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let countOrderStatus1 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let countOrder = await db.Order.count({
        where: { status: 1 },
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        countOrder,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let createOrderDirectPayment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let pu = await db.Customer.findOne({
        where: {
          phonenumber: data.phonenumber,
        },
        attributes: ["email", "fullname", "phonenumber", "address", "id"],
        nest: true,
        raw: false,
      });
      if (pu) {
        let product = data.product;
        let listOr = [];
        let year = moment(new Date()).format("YYYY");
        let month = moment(new Date()).format("MM");
        let day = moment(new Date()).format("DD");
        let codeor = "O3D3R" + year + month + day + getRandomInt(10000);
        await db.Order.create({
          code: codeor,
          fullname: data.fullname,
          email: pu.email,
          cus_id: pu.id,
          voucher_id: 1,
          method_id: 3,
          warehouse_id: data.warehouse_id,
          status: 5,
          Address: pu.address,
          phonenumber: pu.phonenumber,
          paymentstatus: 2,
        }).then(async function (item) {
          await Promise.all(
            product.map(async (x) => {
              let p = await db.Warehouse_product.findOne({
                where: { product_id: x.product_id, optionvalue: x.optionvalue },
                raw: false,
                nest: true,
              });
              for (let i = 0; i < x.amount; i++) {
                let seri = "TPS" + year + month + day + getRandomInt(10000);
                let pp = {};
                let pu = await db.Product.findOne({
                  where: { id: x.product_id },
                  raw: false,
                  nest: true,
                });
                pp.price = pu.unitprice;
                let o = x.optionvalue;
                await Promise.all(
                  o.map(async (y) => {
                    let op = await db.Option_Product.findOne({
                      where: { id: y, product_id: x.product_id },
                      raw: false,
                      nest: true,
                    });
                    if (!op) {
                      resolve({
                        errCode: 1,
                        errMessage:
                          "Your option : " +
                          y +
                          " with product " +
                          x.product_id,
                      });
                    } else {
                      pp.price = pp.price + op.price;
                    }
                  })
                );
                pp.serinumber = seri;
                pp.name = p.name;
                pp.order_id = item.id;
                pp.product_id = x.product_id;
                pp.amount = x.amount;
                pp.optionValues = x.optionvalue;
                pp.TotalQuantity = 1;
                pp.TotalPrice = pp.price;
                await listOr.push(pp);
              }
            })
          );
          await db.Orderitem.bulkCreate(listOr);
          var dateToday = moment(new Date()).format("YYYY-MM-DD");
          var expiredate = moment(dateToday, "YYYY-MM-DD").add(1, "YEAR");
          await db.Warranty.create({
            code: item.code,
            infor: "Đơn bảo hành",
            description:
              "Đơn bảo hành được tạo khi khách hàng đã nhận hàng thành công khi thanh toán trực tiếp tại website",
            order_id: item.id,
            cus_id: item.cus_id,
            expire: expiredate,
          }).then(function (y) {
            if (y.id) {
              // console.log(y);
              // console.log(item.email);
              let dataSend = {
                code: y.code,
                infor: y.infor,
                description: y.description,
                expire: expiredate,
                email: item.email,
              };
              // console.log(dataSend);
              emailService.sendEmailWarranty(dataSend);
            }
          });
          resolve({
            errCode: 0,
            errMessage: "Create Order Successfull: " + item.id,
          });
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
////// update
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
let updateOrderStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = await db.Order.findOne({
        where: { id: id, status: 1 },
        raw: false,
        nest: true,
      });
      if (order) {
        await sequelize.query(
          'UPDATE "Order" SET "status" = :st WHERE "Order"."id" = :id;',
          {
            replacements: { st: 2, id: order.id },
            type: Sequelize.UPDATE,
            nest: true,
            raw: false,
          }
        );
        resolve({
          errCode: 0,
          errMessage: "Update Your Order Successfully",
          orderId: order.id,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Cannot find order",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateOrderStatus3 = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Order = await db.Order.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (!Order) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find your Order ",
        });
      }
      if (Order.status != 2) {
        resolve({
          errCode: 2,
          errMessage: "Your Order not status 2 ",
        });
      } else {
        await sequelize.query(
          'UPDATE "Order" SET "status" = :st WHERE "Order"."id" = :or',
          {
            replacements: { st: 3, or: id },
            type: Sequelize.UPDATE,
            raw: false,
            nest: true,
          }
        );
        resolve({
          errCode: 0,
          errMessage: "Update successfully",
          Order: id,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateOrderStatus4 = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Order = await db.Order.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (!Order) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find your Order ",
        });
      }
      if (Order.status != 3) {
        resolve({
          errCode: 2,
          errMessage: "Your Order not status 3 ",
        });
      } else {
        await sequelize.query(
          'UPDATE "Order" SET "status" = :st WHERE "Order"."id" = :or',
          {
            replacements: { st: 4, or: id },
            type: Sequelize.UPDATE,
            raw: false,
            nest: true,
          }
        );
        let dataSend = {
          email: Order.email,
          name: Order.fullname,
          code: Order.code,
          phone: Order.phonenumber,
          address: Order.Address,
        };
        let dataitem = [];
        let oitem = await db.Orderitem.findAll({
          where: { order_id: id },
          raw: false,
          nest: true,
        });
        if (oitem && oitem.length > 0) {
          dataSend.price = 0;
          await Promise.all(
            oitem.map(async (x) => {
              let obj = {};
              obj.serinumber = x.serinumber;
              obj.name = x.name;
              obj.price = x.price;
              obj.TotalPrice = x.TotalPrice;
              dataSend.price = dataSend.price + x.TotalPrice;
              dataitem.push(obj);
            })
          );
        }
        emailService.sendEmailgoodsreceived(dataSend, dataitem);
        var dateToday = moment(new Date()).format("YYYY-MM-DD");
        var expiredate = moment(dateToday, "YYYY-MM-DD").add(1, "YEAR");
        console.log(expiredate);
        await db.Warranty.create({
          code: Order.code,
          infor: "Đơn bảo hành",
          description:
            "Đơn bảo hành được tạo khi khách hàng đã nhận hàng thành công khi thanh toán trực tiếp tại website",
          order_id: Order.id,
          cus_id: Order.cus_id,
          expire: expiredate,
        }).then(function (x) {
          if (x.id) {
            console.log(x);
            dataSend = {
              code: x.code,
              infor: x.infor,
              description: x.description,
              expire: expiredate,
              email: Order.email,
            };
            emailService.sendEmailWarranty(dataSend);
          }
        });
        resolve({
          errCode: 0,
          errMessage: "Update successfully",
          Order: id,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

//-----------Chart (Thống kê)--------------------------------
let countOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let ordersta4 = await db.Order.count({
        where: { status: 4 },
        raw: false,
        nest: true,
      });
      let price = 0;
      let sumorder = await db.Orderitem.findAll({
        include: [{ model: db.Order, as: "orderItem", where: { status: 4 } }],
        raw: false,
        nest: true,
      });
      if (sumorder && sumorder.length > 0) {
        await Promise.all(
          sumorder.map(async (x) => {
            price = price + x.TotalPrice;
          })
        );
      }
      let order = await db.Order.count({
        raw: false,
        nest: true,
      });
      let product = await db.Orderitem.count({
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        ordersta4,
        price,
        order,
        product,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let orderFormMonth = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = await db.Order.findAll({
        raw: false,
        nest: true,
      });
      if (order && order.length > 0) {
        await Promise.all(
          order.map(async (item) => {
            let dd = moment(item.createdAt).format("YYYY-MM-DD");
            let day = moment(item.createdAt, "YYYY/MM/DD").date();
            let month = moment(item.createdAt, "YYYY/MM/DD").month();
            let year = moment(item.createdAt, "YYYY/MM/DD").year();
            console.log(day, month, year, dd);
          })
        );
      }

      resolve({
        errCode: 0,
        errMessage: "ok",
        order,
      });
    } catch (error) {
      reject(error);
    }
  });
};
// get link momo
let getMomoPaymentLink = async (req) => {
  var requestId = partnerCode + new Date().getTime();
  var orderId = requestId;
  let fOrder = await db.Orderitem.sum("TotalPrice", {
    where: { order_id: req.body.orderId },
    nest: true,
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
    let dataSend = {
      email: orderCurrentData.email,
      name: orderCurrentData.fullname,
      code: orderCurrentData.code,
    };
    emailService.sendEmailPaymentSuccess(dataSend);
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
  getDetailProduct,
  getAllOrderByUser,
  deleteOrder,
  getMomoPaymentLink,
  handleOrderPayment,
  updateOrderStatus,
  updateOrderStatus3,
  updateOrderStatus4,
  cancelOrder,
  getRandomInt,
  countOrderStatus1,
  createOrderDirectPayment,
  countOrder,
  orderFormMonth,
};
