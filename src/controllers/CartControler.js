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

module.exports = {
  handleAddProductToCart,
  handleGetAllCat,
};
