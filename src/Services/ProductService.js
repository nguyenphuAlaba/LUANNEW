import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
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
          {
            model: db.Warehouse_product,
            as: "productwarehouse_product",
            attributes: ["quantity"],
          },
          {
            model: db.Option_Product,
            as: "Option_Product",
            attributes: ["name", "price", "quantity"],
            include: [
              {
                model: db.Option,
                as: "OptionProduct",
                attributes: ["name"],
              },
            ],
          },
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
      let product = await db.Product.findOne({
        where: { id: id },
        include: [
          { model: db.Brand, as: "ProductBrand" },
          { model: db.Category, as: "CategoryProduct" },
        ],
        raw: false,
        nest: true,
      });
      console.log("Product", id);
      resolve(product);
    } catch (e) {
      reject(e);
    }
  });
};
let getProductByBrand = (brand_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("getProductByBrand" + brand_id);
      let product = await db.Product.findAll({
        include: [
          { model: db.Brand, as: "ProductBrand", where: { id: brand_id } },
          { model: db.Product_Image, as: "ProductImg" },
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
          { model: db.Product_Image, as: "ProductImg" },
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
          currentQuantity: product.currentQuantity,
          IntialQuantity: product.IntialQuantity,
          Description: product.Description,
          status: product.status,
          brand_id: product.brand_id,
          category_id: product.category_id,
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
          fproduct.currentQuantity = product.currentQuantity;
          fproduct.IntialQuantity = product.IntialQuantity;
          fproduct.Description = product.Description;
          fproduct.status = product.status;
          fproduct.brand_id = product.brand_id;
          fproduct.category_id = product.category_id;
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
  upload,
};
