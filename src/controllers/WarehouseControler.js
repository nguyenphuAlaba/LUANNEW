import { request } from "express";
import db from "../models/index";
import WarehouseService from "../Services/WarehouseService";

let handleGetAllWarehouse = async (request, response) => {
  try {
    console.log("aaaaaaaaa");
    let warehouse = await WarehouseService.getAllWarehouse();
    return response.status(200).json(warehouse);
  } catch (error) {
    response.status(400).json(error);
  }
};
let handleCreateWarehouse = async (request, response) => {
  try {
    let warehouse = await WarehouseService.createWarehouse(request.body);
    return response.status(200).json(warehouse);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateWarehouse = async (request, response) => {
  try {
    let warehouse = await WarehouseService.updateWarehouse(request.body);
    return response.status(200).json(warehouse);
  } catch (error) {
    return response.status(500).json(error);
  }
};
let handleDeleteWarehouse = async (request, response) => {
  try {
    let warehouse = await WarehouseService.deleteWarehouse(request.params.id);
    return response.status(200).json(warehouse);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllProductInWarehouse = async (request, response) => {
  try {
    let product = await WarehouseService.getAllProductInWarehouse();
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllWarehouse,
  handleCreateWarehouse,
  handleUpdateWarehouse,
  handleDeleteWarehouse,
  handleGetAllProductInWarehouse,
};
