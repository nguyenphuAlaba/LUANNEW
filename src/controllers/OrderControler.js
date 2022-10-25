import db from "../models/index";
import OrderService from "../Services/OrderService";

let handleGetAllOrder = async (request, response) => {
  try {
    let Order = await OrderService.getAllOrder();
    console.log("Order", Order);
    return response.status(200).json(Order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleAllOrderByStatus = async (request, response) => {
  try {
    let statuss = request.params.status;
    console.log("Order : ", statuss);
    let Order = await OrderService.allOrderByStatus(statuss);
    return response.status(200).json(Order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetCreateOrderByUser = async (request, response) => {
  try {
    let data = await OrderService.getCreateOrderByUser(request.body);
    // console.log("BODY ", request.body);
    response.status(200).json({
      data,
    });
  } catch (error) {
    response.status(404).json(error);
  }
};
let handleGetAllOrderByUser = async (request, response) => {
  try {
    let userId = request.params.id;
    let orderlist = await OrderService.getAllOrderByUser(userId);
    response.status(200).json(orderlist);
  } catch (error) {
    response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllOrder,
  handleAllOrderByStatus,
  handleGetCreateOrderByUser,
  handleGetAllOrderByUser,
};
