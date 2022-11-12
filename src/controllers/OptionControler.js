import db from "../models/index";
import OptionService from "../Services/OptionService";

let handleCreateOption = async (request, response) => {
  try {
    let Option = await OptionService.createOption(request.body);
    return response.status(200).json(Option);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteOption = async (request, response) => {
  try {
    let id = await request.params.id;
    let Option = await OptionService.deleteOption(id);
    return response.status(200).json(Option);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handlecreateOptionProduct = async (request, response) => {
  try {
    let Option = await OptionService.createOptionProduct(request.body);
    return response.status(200).json(Option);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetOptionByProductId = async (request, response) => {
  try {
    let id = await request.params.id;
    let Option = await OptionService.getOptionByProductId(id);
    return response.status(200).json(Option);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleFindByOptionId = async (request, response) => {
  try {
    let option = await OptionService.findByOptionId(request.query);
    return response.status(200).json(option);
  } catch (error) {
    return response.status(404).json(error);
  }
};
module.exports = {
  handleCreateOption,
  handleDeleteOption,
  handlecreateOptionProduct,
  handleGetOptionByProductId,
  handleFindByOptionId,
};
