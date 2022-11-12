import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();

var salt = bcrypt.genSaltSync(10);
var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//image la bam 64
//fname ten hinh
let uploadCloud = (image, fName) => {
  return new Promise(async (resolve, reject) => {
    try {
      await cloudinary.uploader.upload(
        image,
        {
          resource_type: "raw",
          public_id: `image/account/${fName}`,
        },
        // Send cloudinary response or catch error
        (err, result) => {
          if (err) console.log(err);
          if (result) {
            resolve(result);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let customer = db.Customer.findAll({
        include: [{ model: db.Order, as: "OrderUser" }],
        raw: false,
        nest: true,
      });
      delete customer.password;
      delete customer.id;
      resolve(customer);
    } catch (error) {
      reject(error);
    }
  });
};

let getUserById = (user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("getUserById", user_id);
      let user = await db.Customer.findOne({
        where: { id: user_id },
        raw: false,
        nest: true,
      });
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
//ma hoa password
let encodePassword = (password) => {
  return Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
//check email
let checkEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("email: ", email);
      let user = await db.Customer.findOne({
        where: { email: email },
      });

      // console.log("user: ", user);

      if (user) resolve(true);
      else resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

//dang ky
let handleSignUpUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password) {
        reject({
          errCode: 2,
          errMessage: "Missing Email and password",
        });
      } else {
        let check = await checkEmail(data.email);
        if (check) {
          reject({
            errCode: 1,
            message: "Email has been exist",
          });
        } else {
          let hashPass = await hashUserPassword(data.password);
          await db.Customer.create({
            email: data.email,
            password: hashPass,
            fullname: data.fullname,
            phonenumber: data.phonenumber,
            role_id: 3,
            avatar: data.avatar,
            isActive: true,
            birthday: data.birthday,
            address: data.address,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//Dang nhap
let handeLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userdata = {};
      let isExist = await checkEmail(email);
      if (isExist) {
        let user = await db.Customer.findOne({
          where: { email: email },
          attributes: [
            "id",
            "email",
            "password",
            "fullname",
            "phonenumber",
            "isActive",
          ],
          raw: false,
          nest: true,
        });
        if (user) {
          let check = bcrypt.compareSync(password, user.password);
          if (check) {
            if (!user.isActive) {
              reject({
                errCode: 1,
                errMessage: "Your account is not Active",
              });
              return;
            }
            userdata.errorCode = 0;
            userdata.errMessage = `Ok`;

            let cus = await db.Customer.findOne({
              where: { id: user.id },
            });

            // xoa password
            delete user.password;
            // xoa userid
            delete user.id;

            user.id = cus.id;
            userdata.user = user;

            //add token
          } else {
            userdata.errCode = 3;
            userdata.errMessage = "Wrong password";
          }
        } else {
          userdata.errorCode = 2;
          userdata.errMessage = `Customer isn't exist`;
        }
      } else {
        userdata.errorCode = 1;
        userdata.errMessage = `Your's email isn't exist in our system`;
      }
      resolve(userdata);
    } catch (error) {
      reject(error);
    }
  });
};
let updateUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // let cuser = await db.Customer.findOne({
      //   where: { id: 2 },
      //   raw: false,
      //   nest: true,
      // });
      let test = await db.Customer.findOne({
        where: { id: +data.id },
        raw: false,
      });
      if (test) {
        test.fullname = data.fullname;
        test.phonenumber = data.phonenumber;
        test.avatar = data.avatar;
        await test.save();
        resolve({
          errCode: 0,
          errMessage: "Update success",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Can't find user",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let changePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Customer = await db.Customer.findOne({
        where: { id: +data.id },
        raw: false,
        nest: true,
      });
      if (data.newpassword == data.repassword) {
        let checkPass = await bcrypt.compareSync(
          data.oldpassword,
          Customer.password
        );
        if (checkPass) {
          let hashPas = await hashUserPassword(data.newpassword);
          Customer.password = hashPas;
          await Customer.save();
          resolve({
            errCode: 0,
            errMessage: "Your password has been Update",
          });
        }
      } else {
        reject({
          errCode: 1,
          errMessage: "Your new password and re-password not correct",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  uploadCloud,
  encodePassword,
  checkEmail,
  handleSignUpUser,
  handeLogin,
  getAllUser,
  getUserById,
  updateUser,
  changePassword,
};
