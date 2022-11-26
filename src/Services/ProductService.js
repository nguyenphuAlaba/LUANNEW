import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
import Product from "../models/Product";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
let memoryStorage = multer.memoryStorage();

let upload = multer({
  storage: memoryStorage,
});
let uploadToCloudinary = async (fileString, format) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { uploader } = cloudinary;
      let res = await uploader.upload(
        `data:image/${format};base64,${fileString}`
      );
      resolve({
        errCode: 0,
        errMessage: "Ok",
        res,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getAllProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let whereStatement = {};
      if (data.brand_id) whereStatement.brand_id = data.brand_id;
      if (data.category_id) whereStatement.category_id = data.category_id;
      let pr = await db.Product.findAll({
        where: whereStatement,
        // {
        //   [Op.or]: [
        //     data.brand_id && {
        //       brand_id: +data.brand_id,
        //     },
        //     data.category_id && {
        //       category_id: +data.category_id,
        //     },
        //   ],
        // },
        include: [
          { model: db.Brand, as: "ProductBrand", attributes: ["name"] },
          { model: db.Category, as: "CategoryProduct", attributes: ["name"] },
          // { model: db.Option, as: "ProductOption", attributes: ["name"] },
          // { model: db.Warehouse, as: "ProductInWarehouse" },
        ],
        raw: false,
        nest: true,
      });

      resolve(pr);
    } catch (e) {
      reject(e);
    }
  });
};
let getProductDetail = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findAll({
        where: { id: id },
        include: [
          { model: db.Brand, as: "ProductBrand" },
          { model: db.Category, as: "CategoryProduct" },
          { model: db.Warehouse, as: "ProductInWarehouse" },
        ],
        raw: false,
        nest: true,
      });
      let option = await db.Product.findAll({
        include: [
          {
            model: db.Option,
            as: "ProductOption",
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
        attributes: ["name"],
        where: { id: id },
        raw: false,
        nest: true,
      });
      let Optionproduct = await db.Option_Product.findAll({
        where: { product_id: id },
        raw: false,
        nest: true,
      });
      resolve({
        product,
        option,
        Optionproduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getProductByBrand = (brand_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findAll({
        include: [
          { model: db.Brand, as: "ProductBrand", where: { id: brand_id } },
          { model: db.Category, as: "CategoryProduct", attributes: ["name"] },
        ],
        raw: false,
        nest: true,
      });
      resolve(product);
    } catch (error) {
      reject(error);
    }
  });
};
let findProductByCategory = (category_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Category: " + category_id);
      let product = await db.Product.findAll({
        include: [
          { model: db.Brand, as: "ProductBrand", attributes: ["name"] },
          {
            model: db.Category,
            as: "CategoryProduct",
            where: { id: category_id },
          },
        ],
        raw: false,
        nest: true,
      });
      resolve(product);
    } catch (error) {
      reject(error);
    }
  });
};

let checkProduct = (product) => {
  return new Promise(async (resolve, reject) => {
    try {
      let fproduct = await db.Product.findOne({
        where: { name: product },
      });
      if (fproduct) resolve(true);
      else resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};
let createProduct = (product) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkProduct(product.name);
      if (check) {
        resolve({
          errCode: 1,
          errMessage: "This product already exists",
        });
      } else {
        await db.Product.create({
          name: product.name,
          unitprice: product.unitprice,
          currentQuantity: 0,
          IntialQuantity: 0,
          Description: product.Description,
          status: 4,
          brand_id: product.brand_id,
          category_id: product.category_id,
          img: product.img,
        });
        resolve({
          errCode: 0,
          errMessage: "add Product successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateProduct = (product) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!product.id) {
        resolve({
          errCode: 2,
          errMessage: "Can't find product with id",
        });
      } else {
        let fproduct = await db.Product.findOne({
          where: { id: product.id },
          include: [
            { model: db.Brand, as: "ProductBrand" },
            { model: db.Category, as: "CategoryProduct", attributes: ["name"] },
          ],
          raw: false,
          nest: true,
        });
        let cproduct = await checkProduct(product.name);
        if (cproduct) {
          resolve({
            errCode: 1,
            errMessage: "Product already exists",
          });
        } else {
          fproduct.name = product.name;
          fproduct.unitprice = product.unitprice;
          fproduct.Description = product.Description;
          fproduct.status = product.status;
          fproduct.brand_id = product.brand_id;
          fproduct.category_id = product.category_id;
          fproduct.img = product.img;
          await fproduct.save();

          resolve({
            errCode: 0,
            errMessage: "Product have been updated successfully",
          });
        }
      }
    } catch (error) {
      console.log("Error");
      reject(error);
    }
  });
};
let handlegetProductByKeyword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data) {
        let listProduct = [];
        if (data) {
          let keyword = `%${data}%`;
          listProduct = await db.Product.findAll({
            where: {
              [Op.or]: [
                {
                  name: { [Sequelize.Op.iLike]: keyword },
                },
              ],
            },
            include: [
              { model: db.Brand, as: "ProductBrand" },
              {
                model: db.Category,
                as: "CategoryProduct",
              },
            ],
            raw: false,
            nest: true,
          });
          resolve({
            errCode: 0,
            errMessage: "Has find successfully",
            listProduct,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteProduct = (product_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (product_id) {
        let cproduct = await db.Product.findOne({
          where: { id: product_id },
        });
        if (cproduct) {
          await db.Product.destroy({
            where: { id: cproduct.id },
          });
          resolve({
            errCode: 0,
            errMessage: "Product has been deleted successfully",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Can't find product",
          });
        }
      } else {
        resolve({
          errCode: 2,
          errMessage: "Missing id property",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateAmountProductWarehouse = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.quantity == 0) {
        reject({
          errCode: 500,
          errMessage: "Dont have Quantity",
        });
      } else {
        let checkProduct = await db.Product.findOne({
          where: { id: data.product_id },
          raw: false,
          nest: true,
        });
        if (!checkProduct) {
          resolve({
            errCode: 1,
            errMessage: "Your product not found",
          });
        } else {
          let checkWarehouse = await db.Warehouse.findOne({
            where: { id: data.warehouse_id },
            raw: false,
            nest: true,
          });
          if (!checkWarehouse) {
            resolve({
              errCode: 2,
              errMessage: "Warehouse not found",
            });
          } else {
            console.log("aaaaaaaaaaaaaa");
            let checkWP = await db.Warehouse_product.findOne({
              where: {
                product_id: data.product_id,
                warehouse_id: data.warehouse_id,
              },
              raw: false,
              nest: true,
            });
            if (checkWP) {
              checkWP.quantity = checkWP.quantity + data.quantity;
              console.log(checkWP.quantity);
              await checkWP.save();
              let totalQ = await db.Warehouse_product.sum("quantity", {
                where: {
                  product_id: data.product_id,
                },
              });
              console.log(totalQ);
              checkProduct.currentQuantity = totalQ;
              await checkProduct.save();
              resolve({
                errCode: 0,
                errMessage: "Add success when warehouse has been added before",
              });
            } else {
              console.log("ccccccccccccccc");
              await db.Warehouse_product.create({
                product_id: data.product_id,
                warehouse_id: data.warehouse_id,
              });
              let totalQ = await db.Warehouse_product.sum("quantity", {
                where: {
                  product_id: data.product_id,
                },
                raw: false,
                nest: true,
              });
              checkProduct.currentQuantity = totalQ;
              await checkProduct.save();
              resolve({
                errCode: -1,
                errMessage:
                  "Add success and create Warehouse Product Successfully",
              });
            }
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllProductWislishByCusID = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Wishlist.findAll({
        where: { cus_id: id },
        raw: false,
      });
      resolve({
        errCode: 0,
        errMessage: "ok",
        product,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let addProductWishlist = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkUser = await db.Customer.findOne({
        where: { id: data.cus_id },
      });
      if (!checkUser) {
        resolve({
          errCode: 1,
          errMessage: "Your customer not found",
        });
      } else {
        let checkProduct = await db.Product.findOne({
          where: { id: data.product_id },
        });
        if (!checkProduct) {
          resolve({
            errCode: 2,
            errMessage: "Product not found",
          });
        } else {
          let Wishlist = await db.Wishlist.findOne({
            where: { cus_id: data.cus_id, product_id: data.product_id },
          });
          if (Wishlist) {
            resolve({
              errCode: 3,
              errMessage: "Your wishlist has exsist",
            });
          } else {
            await db.Wishlist.create({
              cus_id: data.cus_id,
              product_id: data.product_id,
            });
            resolve({
              errCode: 0,
              errMessage: "add to wishlist successfully",
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteProductinWishlist = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        let Wishlist = await db.Wishlist.findOne({
          where: { id: id },
          nest: true,
          raw: false,
        });
        if (Wishlist) {
          await db.Wishlist.destroy({
            where: { id: id },
          });
          resolve({
            errCode: 0,
            errMessage: "Delete Wishlist Successfully",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Cannot find your Wishlist ID",
          });
        }
      } else {
        resolve({
          errCode: 1,
          errMessage: "Missing ID",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getAllProduct,
  getProductDetail,
  getProductByBrand,
  findProductByCategory,
  checkProduct,
  createProduct,
  updateProduct,
  handlegetProductByKeyword,
  deleteProduct,
  uploadToCloudinary,
  updateAmountProductWarehouse,
  addProductWishlist,
  getAllProductWislishByCusID,
  deleteProductinWishlist,
  upload,
};
