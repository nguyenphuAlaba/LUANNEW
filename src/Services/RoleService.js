import db from "../models/index";
// import bcrypt from "bcryptjs";
// import { raw } from "body-parser";
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// var salt = bcrypt.genSaltSync(10);
// var cloudinary = require("cloudinary").v2;

let getAllRole = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let role = await db.Role.findAll({
        include: [
          { model: db.Staff, as: "UserRole", attributes: ["fullname"] },
        ],
        raw: false,
        nest: true,
      });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};
let getUserByIdRole = (roleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let User = await db.Staff.findAll({
        where: { role_id: roleId },
        include: [{ model: db.Role, as: "UserRole" }],
        raw: false,
        nest: true,
      });
      resolve(User);
    } catch (error) {
      reject(error);
    }
  });
};
let createRole = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let crole = await db.Role.findOne({
        where: { rolename: data.rolename },
      });
      if (crole) {
        resolve({
          errCode: 1,
          errMessage: "Your role has been exist",
        });
      } else {
        await db.Role.create({
          rolename: data.rolename,
        });
        resolve({
          errCode: 0,
          errMessage: "Create role successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteRole = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let crole = await db.Role.findOne({
        where: { id: id },
      });
      if (!crole) {
        resolve({
          errCode: 1,
          errMessage: "Can't find your role",
        });
      } else {
        let userrole = await db.User.findOne({
          where: { role_id: id },
        });
        if (userrole) {
          resolve({
            errCode: 2,
            errMessage: "Cannot Delete Because Role Have User",
          });
        } else {
          await db.Role.destroy({
            where: { id: id },
          });
          resolve({
            errCode: 0,
            errMessage: "Delete Role successfully",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getAllRole,
  getUserByIdRole,
  createRole,
  deleteRole,
};
