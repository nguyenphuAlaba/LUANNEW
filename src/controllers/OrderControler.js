import db from "../models/index";
import OrderService from "../Services/OrderService";
const jsonFormat = require("../Services/jsonFormat");

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
let handleDeleteOrder = async (request, response) => {
  try {
    let oderid = request.params.order_id;
    let order = await OrderService.deleteOrder(oderid);
    return response.status(200).json(order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let getMomoPaymentLink = async (req, res) => {
  try {
    const message = await OrderService.getMomoPaymentLink(req);
    if (message.result)
      return res
        .status(200)
        .json(jsonFormat.dataSuccess("Get Link successfully", message.result));
    if (message)
      return res.status(200).json({
        statusCode: 200,
        data: message,
      });
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};
let handleOrderPayment = async (req, res) => {
  try {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + req);
    const result = await OrderService.handleOrderPayment(req);
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Handle payment successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};
let handleUpdateOrderStatus = async (request, response) => {
  try {
    let id = request.params.orderId;
    let order = await OrderService.updateOrderStatus(id);
    return response.status(200).json(order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleCancelOrder = async (request, response) => {
  try {
    let id = request.params.orderId;
    let order = await OrderService.cancelOrder(id);
    return response.status(200).json(order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetDetailProduct = async (request, response) => {
  try {
    let id = request.params.orderId;
    let Order = await OrderService.getDetailProduct(id);
    return response.status(200).json(Order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateOrderStatus3 = async (request, response) => {
  try {
    let id = request.params.orderId;
    let order = await OrderService.updateOrderStatus3(id);
    return response.status(200).json(order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateOrderStatus4 = async (request, response) => {
  try {
    let id = request.params.orderId;
    let order = await OrderService.updateOrderStatus4(id);
    return response.status(200).json(order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleCountOrderStatus1 = async (request, response) => {
  try {
    let Order = await OrderService.countOrderStatus1();
    return response.status(200).json(Order);
  } catch (error) {
    return response.status(500).json(error);
  }
};
let handleCreateOrderDirectPayment = async (request, response) => {
  try {
    let Order = await OrderService.createOrderDirectPayment(request.body);
    return response.status(200).json(Order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleCountOrder = async (request, response) => {
  try {
    let Order = await OrderService.countOrder(request.body);
    return response.status(200).json(Order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleOrderFormMonth = async (request, response) => {
  try {
    let order = await OrderService.orderFormMonth(request.body);
    return response.status(200).json(order);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllOrdersta1 = async (request, response) => {
  try {
    let order = await OrderService.getAllOrdersta1();
    return response.status(200).json(order);
  } catch (error) {
    return response.status(500).json(error);
  }
};
module.exports = {
  handleGetAllOrder,
  handleAllOrderByStatus,
  handleGetCreateOrderByUser,
  handleGetAllOrderByUser,
  handleDeleteOrder,
  getMomoPaymentLink,
  handleOrderPayment,
  handleUpdateOrderStatus,
  handleGetDetailProduct,
  handleCancelOrder,
  handleUpdateOrderStatus3,
  handleUpdateOrderStatus4,
  handleCountOrderStatus1,
  handleCreateOrderDirectPayment,
  handleCountOrder,
  handleOrderFormMonth,
  handleGetAllOrdersta1,
};
