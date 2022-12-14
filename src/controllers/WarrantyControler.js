import db from "../models/index";
import WarrantyService from "../Services/WarrantyService";

let handleGetAllWarranty = async (request, response) => {
  try {
    let id = request.params.storeId;
    let Warranty = await WarrantyService.getAllWarrantyProduct(id);
    return response.status(200).json(Warranty);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleCreateWarranty = async (request, response) => {
  try {
    let Warranty = await WarrantyService.createWarranty(request.body);
    return response.status(200).json(Warranty);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateWarranty = async (request, response) => {
  try {
    let Warranty = await WarrantyService.updateWarranty(request.body);
    return response.status(200).json(Warranty);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleWarrantyByCus = async (request, response) => {
  try {
    let id = request.params.cusId;
    let Warranty = await WarrantyService.warrantyByCus(id);
    return response.status(200).json(Warranty);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllStore = async (request, response) => {
  try {
    let Warranty = await WarrantyService.getAllStore();
    return response.status(200).json(Warranty);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handlGetDetailWarranty = async (request, response) => {
  try {
    let id = request.params.warrantyId;
    let warranty = await WarrantyService.getDetailWarranty(id);
    return response.status(200).json(warranty);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetwarrantyInfor = async (request, response) => {
  try {
    let id = request.params.storeId;
    let warranty = await WarrantyService.getwarrantyInfor(id);
    return response.status(200).json(warranty);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllWarranty,
  handleCreateWarranty,
  handleWarrantyByCus,
  handleUpdateWarranty,
  handleGetAllStore,
  handlGetDetailWarranty,
  handleGetwarrantyInfor,
};
