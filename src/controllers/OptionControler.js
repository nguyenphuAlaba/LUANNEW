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
module.exports = {
  handleCreateOption,
  handleDeleteOption,
};
