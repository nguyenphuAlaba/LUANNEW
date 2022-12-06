import db from "../models/index";
import CategoryService from "../Services/CategoryService";

let handleGetAllCategory = async (request, response) => {
  try {
    let category = await CategoryService.getAllCategory();
    return response.status(200).json(category);
  } catch (error) {
    return response.status(500).json(error);
  }
};
let handleCreateCategory = async (request, response) => {
  try {
    let category = await CategoryService.createCategory(request.body);
    return response.status(200).json({
      category,
    });
  } catch (e) {
    return response.status(500).json(e);
  }
};
let handleUpdatCategory = async (request, response) => {
  try {
    let category = await CategoryService.updateCategory(request.body);
    return response.status(200).json({
      category,
    });
  } catch (error) {
    return response.status(500).json(error);
  }
};
let handleDeleteCategory = async (request, response) => {
  try {
    let categoryId = request.params.id;
    let category = await CategoryService.deleteCategory(categoryId);
    return response.status(200).json(category);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetCategory = async (request, response) => {
  try {
    console.log(request);
    console.log(request.query);
    console.log("aaaaaaaaaaaaaaaaa");
    let category = await CategoryService.getCategory(request.query);
    return response.status(200).json(category);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllCategory,
  handleCreateCategory,
  handleUpdatCategory,
  handleDeleteCategory,
  handleGetCategory,
};
