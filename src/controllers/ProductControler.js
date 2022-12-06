import db from "../models/index";
import ProductService from "../Services/ProductService";
const { ErrorHandler } = require("../utils/errorHandler");
const { bufferToDataURI } = require("../utils/file");
let handlegetallProduct = async (Request, Response) => {
  let products;
  try {
    products = await ProductService.getAllProduct(Request.query);
    return Response.status(200).json({
      errCode: 0,
      errMessage: "OK",
      products,
    });
  } catch (errCode) {
    console.log("e", errCode);
  }
};
let handlegetbyidProduct = async (Request, Response) => {
  const product_id = Request.params.id;
  try {
    let product = await ProductService.getProductDetail(product_id);
    return Response.status(200).json(product);
  } catch (err) {
    return Response.status(400).json(err);
  }
};
let handlegetProductByBrand = async (request, response) => {
  let brand = request.params.brand_id;
  // console.log("brand_id: " + brand);
  try {
    if (brand) {
      let product = await ProductService.getProductByBrand(brand);
      // console.log("aaaaaa");
      return response.status(200).json({
        product,
      });
    }
  } catch (error) {
    return response.status(400).json({
      errCode: -1,
      errMessage: "Brand not found",
    });
  }
};
let handleFindProductByCategory = async (request, response) => {
  let category = request.params.category_id;
  // console.log("Category: " + category);
  try {
    if (category) {
      let product = await ProductService.findProductByCategory(category);
      return response.status(200).json({
        product,
      });
    }
  } catch (error) {
    response.status(404).json({
      errorCode: -1,
      errorMessage: "Category not found",
    });
  }
};
let handleUploadImg = async (request, response) => {
  try {
    //let { file } = await request.body;

    const { file } = request;
    console.log("file: ", file);
    if (!file) {
      console.log("vvv");
      return response.status(404).json({
        errCode: 1,
        errMessage: "File not found",
      });
    }

    let fileFormat = file.mimetype.split("/")[1];
    let { base64 } = bufferToDataURI(fileFormat, file.buffer);
    let imageDetails = await ProductService.uploadToCloudinary(
      base64,
      fileFormat
    );
    return response.status(200).json(imageDetails);
  } catch (error) {
    return response.status(404).json(error);
  }
};
let handleCreateProduct = async (request, response) => {
  try {
    // console.log("aaaaa");
    let product = await ProductService.createProduct(request.body);
    //////////////////////////////////
    /////////////////////
    response.status(200).json({
      product,
      // imageDetails,
    });
  } catch (error) {
    response.status(400).json(error);
  }
};
let handleUpdateProduct = async (request, response) => {
  try {
    // console.log(request.body);
    let product = await ProductService.updateProduct(request.body);
    // console.log(request.body);
    response.status(200).json({
      product,
    });
  } catch (error) {
    response.status(404).json(error);
  }
};
let getProductByKeyword = async (request, response) => {
  let keyword = request.params.keyword;
  try {
    if (keyword) {
      let product = await ProductService.handlegetProductByKeyword(keyword);
      response.status(200).json(product);
    }
  } catch (error) {
    response.status(404).json(error);
  }
};
let handleDeleteProduct = async (request, response) => {
  try {
    let productId = request.params.id;
    let product = await ProductService.deleteProduct(productId);
    response.status(200).json(product);
  } catch (error) {
    response.status(404).json(error);
  }
};
let handleUpdateAmountProductWarehouse = async (request, response) => {
  try {
    let product = await ProductService.updateAmountProductWarehouse(
      request.body
    );
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleAddProductWishlist = async (request, response) => {
  try {
    let product = await ProductService.addProductWishlist(request.body);
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllProductWislishByCusID = async (request, response) => {
  try {
    let cusId = await request.params.cus_id;
    let wishlist = await ProductService.getAllProductWislishByCusID(cusId);
    return response.status(200).json(wishlist);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteProductinWishlist = async (request, response) => {
  try {
    let id = await request.params.wishlist_id;
    let wishlist = await ProductService.deleteProductinWishlist(id);
    return response.status(200).json(wishlist);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleAddProductView = async (request, response) => {
  try {
    let viewed = await ProductService.addProductView(request.body);
    return response.status(200).json(viewed);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllProductView = async (request, response) => {
  try {
    let cusId = await request.params.cus_id;
    let viewlist = await ProductService.getAllProductView(cusId);
    return response.status(200).json(viewlist);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleCreateOptionProduct = async (request, response) => {
  try {
    let product = await ProductService.createOptionProduct(request.body);
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateOptionProduct = async (request, response) => {
  try {
    let product = await ProductService.updateOptionProduct(request.body);
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteOption = async (request, response) => {
  try {
    let optionID = await request.params.optionid;
    let option = await ProductService.deleteOption(optionID);
    return response.status(200).json(option);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllOptionProduct = async (request, response) => {
  try {
    let product = await ProductService.getAllOptionProduct();
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetOption = async (request, response) => {
  try {
    let product = await ProductService.getOption();
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleCreateWareHouseProduct = async (request, response) => {
  try {
    let product = await ProductService.createWareHouseProduct(request.body);
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handlegetallProduct,
  handlegetbyidProduct,
  handlegetProductByBrand,
  handleFindProductByCategory,
  handleCreateProduct,
  handleUpdateProduct,
  getProductByKeyword,
  handleDeleteProduct,
  handleUploadImg,
  handleUpdateAmountProductWarehouse,
  handleAddProductWishlist,
  handleGetAllProductWislishByCusID,
  handleDeleteProductinWishlist,
  handleAddProductView,
  handleGetAllProductView,
  handleCreateOptionProduct,
  handleUpdateOptionProduct,
  handleDeleteOption,
  handleGetAllOptionProduct,
  handleGetOption,
  handleCreateWareHouseProduct,
};
