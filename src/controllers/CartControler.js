import db from "../models/index";
import CartService from "../Services/CartService";

let handleGetAllCat = async (request, response) => {
  try {
    let Cart = await CartService.getAllCart();
    return response.status(200).json(Cart);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleAddProductToCart = async (request, response) => {
  try {
    let Cart = await CartService.addProductToCart(request.body);
    return response.status(200).json(Cart);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetCartByCustomer = async (request, response) => {
  try {
    let id = await request.params.id;
    let Cart = await CartService.getCartByCustomer(id);
    return response.status(200).json(Cart);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateAmount = async (request, response) => {
  try {
    let Cart = await CartService.updateAmount(request.body);
    return response.status(200).json(Cart);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handlPlusMinusAmount = async (request, response) => {
  try {
    let Cart = await CartService.plusMinusAmount(request.body);
    return response.status(200).json(Cart);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteCartitem = async (request, response) => {
  try {
    let cart_id = request.params.cart_id;
    let cart = await CartService.deleteCartitem(cart_id);
    return response.status(200).json(cart);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteAllCartitem = async (request, response) => {
  try {
    let cart_id = request.params.cart_id;
    let cart = await CartService.deleteAllCartitem(cart_id);
    return response.status(200).json(cart);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleAddProductToCart,
  handleUpdateAmount,
  handleGetAllCat,
  handleGetCartByCustomer,
  handlPlusMinusAmount,
  handleDeleteCartitem,
  handleDeleteAllCartitem,
};
