import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
require("dotenv").config();
import moment from "moment";
var salt = bcrypt.genSaltSync(10);
import emailService from "./emailService";
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
      let customer = await db.Customer.findAll({
        raw: false,
        nest: true,
      });
      delete customer.password;
      delete customer.id;
      resolve({
        errCode: 0,
        errMessage: "Ok",
        customer,
      });
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
      resolve({ errCode: 0, errMessage: "Ok", user });
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
            isActive: false,
            birthday: data.birthday,
            address: data.address,
          }).then(function (x) {
            if (x.id) {
              let dataSend = {};
              dataSend.email = x.email;
              dataSend.userId = x.id;
              emailService.sendEmailActive(dataSend);
              resolve({
                errCode: 0,
                errMessage: "OK",
              });
            }
          });
        }
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
            let c = true;
            if (user.isActive == false) {
              c = false;
              resolve({
                errCode: 1,
                errMessage: "Your account is not active",
              });
            }
            if (c) {
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
            }
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
        } else {
          resolve({ errCode: 2, errMessage: "Your Old password not correct" });
        }
      } else {
        resolve({
          errCode: 1,
          errMessage: "Your new password and re-password not correct",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let loginAdmin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userdata = {};
      let isExist = await db.Staff.findOne({
        where: { email: email },
      });
      if (isExist) {
        let user = await db.Staff.findOne({
          where: { email: email },
          attributes: [
            "id",
            "email",
            "password",
            "fullname",
            "phonenumber",
            "role_id",
          ],
          raw: false,
          nest: true,
        });
        if (user) {
          let check = await db.Staff.findOne({
            where: {
              email: user.email,
              password: password,
            },
            nest: true,
          });
          if (check) {
            let time = await db.Warehouse_staff.findOne({
              where: { sta_id: user.id },
            });
            var dateToday = moment(new Date()).format("YYYY-MM-DD");
            let checkpoint = true;
            var end = moment(time.endtime, "YYYY-MM-DD");
            let check = moment.duration(end.diff(dateToday)).asDays();
            let cus = await db.Staff.findOne({
              where: { id: user.id },
            });
            if ((cus.role_id = 2 && check < 1)) {
              checkpoint = false;
              userdata.errCode = 4;
              userdata.errMessage = "Your work time is expired";
            }
            if (checkpoint) {
              userdata.errorCode = 0;
              userdata.errMessage = `Ok`;

              // xoa password
              delete user.password;
              // xoa userid
              delete user.id;

              user.id = cus.id;
              userdata.user = user;
            }
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
let getAllStaff = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let staff = await db.Staff.findAll({
        Order: ["warehouse_id"],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        errMessage: "Ok",
        staff,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getAllOrderInWarehouse = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let staff = await db.Warehouse_staff.findOne({
        where: { sta_id: data.sta_id, warehouse_id: data.warehouse_id },
        raw: false,
        nest: true,
      });
      if (staff) {
        let order = await db.Order.findAll({
          where: { warehouse_id: data.warehouse_id, status: 1 },
          raw: false,
          nest: true,
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
          order,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Staff not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let forgetPassWord = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await db.Customer.findOne({
        where: { email: data.email },
        attributes: ["email"],
      });
      if (check) {
        let dataSend = {
          email: check.email,
        };
        emailService.sendEmailResetPass(dataSend);
        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Your email not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let resetPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.password) {
        resolve({
          errCode: 1,
          errMessage: "Missing required password",
        });
      }
      let cus = await db.Customer.findOne({
        where: { email: data.email },
        raw: false,
        nest: true,
      });
      if (cus) {
        let hashPas = await hashUserPassword(data.newpassword);
        cus.password = hashPas;
        await cus.save();
        resolve({
          errCode: 0,
          errMessage: "Update password success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let acctive = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let getUser = await db.Customer.findOne({
        where: { id: id },
        raw: false,
        nest: true,
      });
      if (getUser) {
        getUser.isActive = true;
        await getUser.save();
        resolve({
          errCode: 0,
          errMessage: "Your account has active",
          name: "Acount " + getUser.email + " Has been acctive ",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Cannot find your account",
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
  loginAdmin,
  getAllStaff,
  getAllOrderInWarehouse,
  forgetPassWord,
  resetPassword,
  acctive,
};
