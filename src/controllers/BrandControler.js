import db from "../models/index";
import BrandService from "../Services/BrandService";

let handleGetAllBrand = async (request, response) => {
  try {
    let brand = await BrandService.getAllBrand();
    return response.status(200).json(brand);
  } catch (e) {
    response.status(500).json(e);
  }
};
let handleCreateBrand = async (request, response) => {
  try {
    let brand = await BrandService.createBrand(request.body);
    return response.status(200).json({
      brand,
    });
  } catch (e) {
    return response.status(500).json(e);
  }
};
let handleUpdateBrand = async (request, response) => {
  try {
    let brand = await BrandService.updateBrand(request.body);
    return response.status(200).json({
      brand,
    });
  } catch (error) {
    return response.status(500).json(error);
  }
};
let handleDeleteBrand = async (request, response) => {
  try {
    let brand_id = await request.params.id;
    let brand = await BrandService.deleteBrand(brand_id);
    response.status(200).json(brand);
  } catch (error) {
    response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllBrand,
  handleCreateBrand,
  handleUpdateBrand,
  handleDeleteBrand,
};
