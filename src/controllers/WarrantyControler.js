import db from "../models/index";
import WarrantyService from "../Services/WarrantyService";

let handleGetAllWarranty = async (request, response) => {
  try {
    let Warranty = await WarrantyService.getAllWarranty();
    return response.status(200).json(Warranty);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllWarranty,
};
