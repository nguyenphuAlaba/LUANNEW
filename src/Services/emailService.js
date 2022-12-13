require("dotenv").config();

import nodemailer from "nodemailer";
import TemplateEmail from "../public/TemplateEmail";

let sendSimpleEmail = async (dataSend, dataarray) => {
  //   console.log(dataSend);
  //   console.log(dataarray);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });
  let info = await transporter.sendMail({
    from: '"PhuThangShop" <phunguyen22052000@gmail.com>', // sender address
    to: dataSend.email, //dataSend.reciverEmail, // list of receivers
    subject: "Thông tin Bán Hàng", // Subject line
    html: TemplateEmail.templatepurchase(dataSend, dataarray),
    // TemplateEmail.templatepurchase(dataSend)
    //dataSend.email
  });
};

let sendEmailActive = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"PhuThangShop" <NguyenThienPhu@gmail.com>', // sender address
    to: dataSend.email, // list of receivers dataSend.reciverEmail
    subject: "Xác thực email", // Subject line
    html: TemplateEmail.templateActiveAccount(dataSend), // html body
  });
};

let sendEmailResetPass = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"PhuThangShop" <NguyenThienPhu@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Quên mật khẩu", // Subject line
    html: TemplateEmail.templateResetPass(dataSend), // html body
  });
};

let sendEmailVoucherFree = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"DK Cinemas" <khoadido@gmail.com>', // sender address
    to: dataSend.reciverEmail, // list of receivers
    subject: "Voucher free ticket", // Subject line
    html: `
        <p>DKCinema xin gửi voucher miễn phí 1 vé (Áp dụng cho 1 lần đặt): ${dataSend.voucherCode}</p>
        <p>Trân trọng cám ơn quý khách đã luôn đồng hành cùng với DKCinema.</p>
        `, // html body
  });
};

let sendEmailVoucherGif = (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      // create reusable transporter object using the default SMTP transport
      //  console.log('dataSend: ', dataSend);
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });

      if (dataSend && dataSend.length > 0) {
        await Promise.all(
          dataSend.map(async (item, index) => {
            console.log(item);
            // send mail with defined transport object
            await transporter.sendMail({
              from: '"PhuThangShop" <NguyenThienPhu@gmail.com>', // sender address
              to: item.email, // list of receivers
              subject: "Voucher Chúc mừng sinh nhật", // Subject line
              html: `
                            <h2>Chúc mừng sinh nhật</h2>
                            <hr>
                            <p>Nhân dịp sinh nhật của quý khách. Cửa hàng Phú Thắng  xin gửi voucher giảm giá ${item.data.discoutNumber}% giá vé (Áp dụng cho 1 lần đặt): ${item.data.gifCode}</p>
                            <p>Cửa hàng Phú Thắng kính chúc quý khách ngày sinh nhật vui vẻ, đầm ấm bên người thân và gia đình.</p>
                            <p>Trân trọng cám ơn quý khách đã luôn đồng hành cùng với Phú Thắng cửa hàng.</p>
                            `, // html body
            });
          })
        );
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let sendEmailNewProduct = (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      // create reusable transporter object using the default SMTP transport
      // console.log("maiList: ", maiList);
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
      let info = await transporter.sendMail({
        from: '"PhuThangShop" <NguyenThienPhu@gmail.com>', // sender address
        to: "anhdansgvn@gmail.com", // list of receivers maiList
        subject: "Sản phẩm mới ra mắt !!!", // Subject line
        html: TemplateEmail.newProductComeOut(dataSend), // html body
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  sendSimpleEmail,
  sendEmailActive,
  sendEmailResetPass,
  sendEmailVoucherGif,
  sendEmailNewProduct,
  sendEmailVoucherFree,
};
