import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
import Product from "../models/Product";
import Option_Product from "../models/Option_Product";
import { dataError } from "./jsonFormat";
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
      whereStatement.status = 1;
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
        attributes: [
          "id",
          "name",
          "unitprice",
          "currentQuantity",
          "Description",
          "img",
          "ProductOption.Option_Product.product_id",
          "ProductOption.id",
        ],
        include: [
          // { model: db.Brand, as: "ProductBrand", attributes: ["name"] },
          // { model: db.Category, as: "CategoryProduct", attributes: ["name"] },
          // {
          //   model: db.Warehouse,
          //   as: "ProductInWarehouse",
          //   attributes: ["name"],
          // },
          {
            model: db.Option,
            as: "ProductOption",
            order: ["option_id"],
          },
        ],
        // group: ["Product.id"],
        raw: true,
      });
      resolve({
        errCode: 0,
        errMessage: "OK",
        product,
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
          errCode: 1,
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
        // let cproduct = await checkProduct(product.name);
        if (!product.Description) {
          product.Description = fproduct.Description;
        }
        if (!product.img) {
          product.img = fproduct.img;
        }
        if (!product.unitprice) {
          product.unitprice = fproduct.unitprice;
        }
        if (!product.name) {
          product.name = fproduct.name;
        }
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
          await db.Option_Product.destroy({
            where: { product_id: cproduct.id },
          });
          await db.Warehouse_product.destroy({
            where: { product_id: cproduct.id },
          });
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
      let checkProduct = await db.Product.findOne({
        where: { id: data.product_id },
        raw: false,
        nest: true,
      });
      let checkWarehouse = await db.Warehouse.findOne({
        where: { id: data.warehouse_id },
        raw: false,
        nest: true,
      });
      if (!checkProduct || !checkWarehouse) {
        resolve({
          errCode: 1,
          errMessage: "Cannot Find Your Product Or Warehouse",
        });
      } else {
        let OP = await db.Option_Product.findOne({
          where: { id: data.color_id, product_id: data.product_id },
          raw: false,
          nest: true,
        });
        if (OP.option_id == 1) {
          let checkWare = await db.Warehouse_product.findOne({
            where: { product_id: data.product_id, color_id: data.color_id },
            raw: false,
            nest: true,
          });
          if (checkWare) {
            checkWare.quantity = checkWare.quantity + data.quantity;
            await checkWare.save();
            let sum = await db.Warehouse_product.sum("quantity", {
              where: { product_id: data.product_id },
              nest: true,
            });
            checkProduct.currentQuantity = sum;
            await checkProduct.save();
            resolve({
              errCode: 0,
              errMessage: "Update amount successfully",
            });
          } else {
            await db.Warehouse_product.create({
              product_id: data.product_id,
              warehouse_id: data.warehouse_id,
              color_id: data.color_id,
              quantity: data.quantity,
            });
            let sum = await db.Warehouse_product.sum("quantity", {
              where: { product_id: data.product_id },
              nest: true,
            });
            checkProduct.currentQuantity = sum;
            await checkProduct.save();
            resolve({
              errCode: -1,
              errMessage: "Create Warehouse Product by color_id successfully",
            });
          }
        } else {
          resolve({
            errCode: 2,
            errMessage: "Your Color_id are not found",
          });
        }
        if (!OP) {
          resolve({
            errCode: 3,
            errMessage: "Option not found",
          });
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
        include: [{ model: db.Product, as: "ProductWishlist" }],
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
            errMessage: "Cannot find your Wishlist ",
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
let addProductView = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkUser = await db.Customer.findOne({
        where: { id: data.cus_id },
      });
      let checkProduct = await db.Product.findOne({
        where: { id: data.product_id },
      });
      if (!checkUser || !checkProduct) {
        resolve({
          errCode: 1,
          errMessage: "Missing require",
        });
      } else {
        let checkview = await db.Viewed.findOne({
          where: { cus_id: data.cus_id, product_id: data.product_id },
        });
        if (checkview) {
          resolve({
            errCode: 1,
            errMessage: "already have view",
          });
        } else {
          await db.Viewed.create({
            cus_id: data.cus_id,
            product_id: data.product_id,
          });
          resolve({
            errCode: 0,
            errMessage: "Add to view successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllProductView = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let findP = await db.Viewed.findAll({
        where: { cus_id: id },
        include: [{ model: db.Product, as: "ViewProduct" }],
        raw: false,
        nsst: true,
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        findP,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let createOptionProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.product_id || !data.name) {
        reject({
          errMessage: "Missing required",
        });
      } else {
        console.log("aaaaaaaaaaa");
        let checP = await db.Product.findOne({
          where: { id: data.product_id },
        });
        if (!checP) {
          resolve({
            errCode: 1,
            errMessage: "Your product not found",
          });
        }
        let checkO = await db.Option.findOne({
          where: { id: data.option_id },
        });
        if (!checkO) {
          resolve({
            errCode: 2,
            errMessage: "Your option not found",
          });
        }
        let checkOP = await db.Option_Product.findOne({
          where: {
            [Op.and]: [
              { product_id: data.product_id },
              { option_id: data.option_id },
              { name: { [Op.iLike]: `%${data.name}%` } },
            ],
          },
          raw: false,
          nest: true,
        });
        if (checkOP) {
          resolve({
            errCode: 3,
            errMessage: "Your option has been exist",
          });
        } else {
          await db.Option_Product.create({
            name: data.name,
            price: data.price,
            product_id: data.product_id,
            option_id: data.option_id,
          });
          resolve({
            errCode: 0,
            errMessage: "Create option successfully",
          });
        }
        if (!checkOP) {
          resolve({
            errCode: 4,
            errMessage: "Your Option not matching with Product",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateOptionProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.price) {
        resolve({
          errCode: 2,
          errMessage: "Missing required",
        });
      } else {
        let checkOP = await db.Option_Product.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (checkOP) {
          // let checkname = await await db.Option_Product.findOne({
          //   where: {
          //     name: { [Op.iLike]: `%${data.name}%` },
          //     product_id: checkOP.product_id,
          //   },
          //   raw: false,
          // });
          // if (checkname) {
          //   resolve({
          //     errCode: 3,
          //     errMessage: "Your Option name has exist in your product",
          //   });
          // } else {
          checkOP.name = data.name;
          checkOP.price = data.price;
          checkOP.option_id = data.option_id;
          checkOP.product_id = data.product_id;
          await checkOP.save();
          resolve({
            errCode: 0,
            errMessage: "Update option successfully",
          });
          // }
        } else {
          resolve({
            errCode: 1,
            errMessage: "Cannt find your Option Product",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteOption = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkO = await db.Option_Product.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (checkO) {
        await db.Option_Product.destroy({
          where: { id: id },
        });
        resolve({
          errCode: 0,
          errMessage: "Delete Option product successfully",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Cann't find your Option product ID",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllOptionProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Option = await db.Option_Product.findAll({
        attributes: ["name", "id", "product_id", "option_id", "price"],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "OK",
        Option,
      });
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
  addProductView,
  getAllProductView,
  createOptionProduct,
  updateOptionProduct,
  deleteOption,
  getAllOptionProduct,
  upload,
};
