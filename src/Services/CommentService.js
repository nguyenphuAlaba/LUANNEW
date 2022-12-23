import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;

let getAllCommentOfProductRate = (Product) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(Product);
      let Comment = await db.Comment.findAll({
        include: [
          {
            model: db.Product,
            as: "CommentProduct",
            where: { id: Product },
            attributes: ["name"],
          },
          { model: db.Customer, as: "commentUser", attributes: ["fullname"] },
        ],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        Comment,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let addComment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Comment.create({
        cus_id: data.cus_id,
        product_id: data.product_id,
        description: data.description,
        rate: data.rate,
        status: 1,
      });
      resolve({
        errCode: 0,
        errMessage: "Has been add Comment",
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let updateComment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data);
      let fcomment = await db.Comment.findOne({
        where: { id: data.id, cus_id: data.cus_id },
        raw: false,
        nest: true,
      });
      let product = await db.Product.findOne({
        where: { id: data.product_id },
        raw: false,
      });
      if (!product) {
        resolve({
          errCode: 2,
          errMessage: "Product not found",
        });
      }
      if (fcomment) {
        fcomment.description = data.description;
        fcomment.status = 1;
        fcomment.rate = data.rate;
        await fcomment.save();
        resolve({
          errCode: 0,
          errMessage: "Update Comment Successfully",
        });
      }
      if (!fcomment) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find comment",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteComment = (comment) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!comment) {
        resolve({
          errCode: 1,
          errMessage: "Missing id",
        });
      } else {
        let fcomment = await db.Comment.findOne({
          where: { id: comment },
        });
        if (!fcomment) {
          resolve({ errCode: 2, errMessage: "Cannot find Comment id" });
        } else {
          await db.Comment.destroy({
            where: { id: comment },
          });
          resolve({
            errCode: 0,
            errMessage: "Delete Comment Successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllComment = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let comment = await db.Comment.findAll({
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "OK",
        comment,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getCommentCustomer = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let comment = await db.Comment.findAll({
        where: { cus_id: id },
        raw: false,
        nest: true,
      });
      if (!comment) {
        resolve({
          errCode: 1,
          errMessage: "Cannot find customer comment",
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Ok",
        comment,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let createCommentResponse = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data);
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: "Missing required data",
        });
      }
      let cm = await db.Comment.findOne({
        where: { id: data.comment_id },
      });
      if (cm) {
        await db.CommentRespon.create({
          comment_id: data.comment_id,
          description: data.description,
        });
        resolve({
          errCode: 0,
          errMessage: "Comment Response Created Successfully",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Comment not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllCommentResponses = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required",
        });
      }
      let commentres = await db.CommentRespon.findAll({
        where: { comment_id: id },
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        commentres,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let updateCommentResponse = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let comment = await db.CommentRespon.findOne({
        where: {
          id: data.id,
          cus_id: data.cus_id,
          comment_id: data.comment_id,
        },
        raw: false,
        nest: true,
      });
      if (!comment) {
        resolve({
          errCode: 1,
          errMessage: "Comment not found",
        });
      } else {
        comment.description = data.description;
        await comment.save();
        resolve({
          errCode: 0,
          errMessage: "Update comment successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteCommentResponse = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let comment = await db.CommentRespon.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (!comment) {
        resolve({
          errCode: 1,
          errMessage: "Comment not found",
        });
      } else {
        await db.CommentRespon.destroy({
          where: { id: id },
        });
        resolve({
          errCode: 0,
          errMessage: "Delete comment successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getAllCommentOfProductRate,
  getAllComment,
  addComment,
  updateComment,
  deleteComment,
  getCommentCustomer,
  createCommentResponse,
  getAllCommentResponses,
  updateCommentResponse,
  deleteCommentResponse,
};
