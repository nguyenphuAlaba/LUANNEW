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

let sendEmailPaymentSuccess = async (dataSend) => {
  console.log("meail : " + dataSend);
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
    subject: " Đơn hàng : " + dataSend.code + " Thanh toán thành công ", // Subject line
    html: `
        <h1>Cửa hàng Phú Thắng trân thành cảm ơn quý khách ${dataSend.name}</h1>
        <hr>
        <p>Đơn hàng sẽ được giao tới cho quý khách trong vòng 3 - 7 ngày xin quý khách hãy để ý tới điện thoại của mình</p>
        <p>Cảm ơn quý khách đã luôn đồng hành cùng với cửa hàng Phú Thắng.</p>
        `, // html body
  });
};
let sendEmailVoucherEvent = async (dataSend) => {
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
    subject: "Tặng voucher Khuyến mãi nhân dịp ", // Subject line
    html: `
        <p>Cửa hàng Phú Thắng xin gửi voucher giảm giá 5% nhân dịp: ${dataSend.name}</p>
        <h3>Mã khuyến mãi: ${dataSend.data.codeE}  Giảm giá: ${dataSend.data.disco}</h3>
        <p>Trân trọng cám ơn quý khách đã luôn đồng hành cùng với Cửa hàng phú thắng.</p>
        `, // html body
  });
};

let sendEmailgoodsreceived = async (dataSend, dataitem) => {
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
    subject: "Đơn hàng: " + dataSend.code + " Giao hàng thành công", // Subject line
    html: `
    <!doctype html>
    <html lang="en-US">
    <head>
    <style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

    td, th {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    tr:nth-child(even) {
      background-color: #dddddd;
    }
    </style>
      </head>
  <body>
  <header>
    <h1 style = "color: green">Giao hàng thành công</h1>
    <h3>Đơn hàng của bạn: ${dataSend.code} Đã được giao tới nơi</h3>
    <hr>
    </header>
    <table>
    <tr>
    <th>Mã</th>
    <th>Sản phẩm</th>
    <th>Số lượng</th>
    <th>Thành tiền</th>
    </tr>
    ${dataitem
      .map((item) => {
        return `
      <tr>
      <td>${item.serinumber}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.TotalPrice}</td>
      </tr>`;
      })
      .join("")}
    </table>
    <hr>
    <h3>Tổng tiền: ${dataSend.price}</h3>
    <hr>
    <p>Cảm ơn quý khách đã tin tưởng cửa hàng của chúng tôi, chúng tôi hy vọng sẽ được phục vụ quý khách vào lần tới.</p>
    <p>Trong quá trình mua bán hay vận chuyển có vấn đề gì xin quý khách hãy vui lòng liên hệ với bên cửa hàng, cửa hàng sẽ đổi mới sản phẩm cho quý khách trong vòng 3 ngày.</p>
    <p> Chú ý: chúng tôi sẽ không chịu trách nhiệm nếu khách cố tình gây thương tích cho sản phẩm bên chúng tôi.</p>
    </body>
    </html>
    `,
  });
};
let sendEmailWarranty = async (dataSend) => {
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
    subject: "Đơn bảo hành của đơn hàng : " + dataSend.code, // Subject line
    html: `
    <!doctype html>
    <html lang="en-US">
    <head>
    <style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

    td, th {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    tr:nth-child(even) {
      background-color: #dddddd;
    }
    </style>
      </head>
  <body>
  <header>
    <h1 style = "color: green">Đơn bảo hành online</h1>
    <h3>${dataSend.infor} của đơn ${dataSend.code}</h3>
    <p>${dataSend.description}</p>
    <hr>
    <h3>Các sản phẩm sau sẽ được bảo hành</h3>
    </header>
    <hr>
    <h3>Hạn bảo hành ${dataSend.expire}</h3>
    <hr>
    <h3>Các trường hợp không được bảo hành</h3>
    <p>* Máy không còn trong thời gian bảo hành</p>
    <p>* Máy bị nhúng nước</p>
    <p>* Máy bị hư hỏng nặng nề do bị rơi hoặc va chạm mạnh</p>
    <p>* Máy không còn nhãn hiệu, tem trên máy</p>
    <p>* Máy bị thay đổi phụ kiện bên trong</p>
    </body>
    </html>
    `,
  });
};

module.exports = {
  sendSimpleEmail,
  sendEmailActive,
  sendEmailResetPass,
  sendEmailVoucherGif,
  sendEmailNewProduct,
  sendEmailVoucherEvent,
  sendEmailPaymentSuccess,
  sendEmailgoodsreceived,
  sendEmailWarranty,
};
