import db from "../models/index";
import CustomerService from "../Services/CustomerService";

let handleGetAllUser = async (request, response) => {
  try {
    let Customer = await CustomerService.getAllUser();
    return response.status(200).json(Customer);
  } catch (error) {
    return response.status(500).json(error);
  }
};
let handleGetById = async (request, response) => {
  try {
    let id = await request.params.id;
    console.log("id: " + id);
    let customer = await CustomerService.getUserById(id);
    return response.status(200).json({
      errCode: 0,
      errMessage: "Customer has found",
      customer,
    });
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleSignUp = async (request, response) => {
  try {
    let message = await CustomerService.handleSignUpUser(request.body);
    return response.status(200).json(message);
  } catch (error) {
    response.status(500).json(error.message);
  }
};

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      errorCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  let userdata = await CustomerService.handeLogin(email, password);

  return res.status(200).json({
    errorCode: userdata.errorCode,
    errMessage: userdata.errMessage,
    data: userdata.user ? userdata.user : {},
  });
};
let handleUpdateUser = async (request, response) => {
  try {
    let userId = await CustomerService.updateUser(request.body);
    return response.status(200).json(userId);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleChangePassword = async (request, response) => {
  try {
    let User = await CustomerService.changePassword(request.body);
    return response.status(200).json(User);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleLoginAdmin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      errorCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  let userdata = await CustomerService.loginAdmin(email, password);

  return res.status(200).json({
    errorCode: userdata.errorCode,
    errMessage: userdata.errMessage,
    data: userdata.user ? userdata.user : {},
  });
};
let handleGetAllStaff = async (request, response) => {
  try {
    let Staff = await CustomerService.getAllStaff();
    return response.status(200).json(Staff);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllOrderInWarehouse = async (request, response) => {
  try {
    let Order = await CustomerService.getAllOrderInWarehouse(request.body);
    return response.status(200).json(Order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleForgetPassWord = async (request, response) => {
  try {
    let forgot = await CustomerService.forgetPassWord(request.body);
    return response.status(200).json(forgot);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleResetPassword = async (request, response) => {
  try {
    let pass = await CustomerService.resetPassword(request.body);
    return response.status(200).json(pass);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleAcctive = async (request, response) => {
  try {
    let id = request.params.userId;
    let user = await CustomerService.acctive(id);
    return response.status(200).json(user);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllUser,
  handleGetById,
  handleSignUp,
  handleLogin,
  handleUpdateUser,
  handleChangePassword,
  handleLoginAdmin,
  handleGetAllStaff,
  handleGetAllOrderInWarehouse,
  handleForgetPassWord,
  handleResetPassword,
  handleAcctive,
};
