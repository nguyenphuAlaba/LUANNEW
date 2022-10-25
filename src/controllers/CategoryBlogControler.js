import db from "../models/index";
import CategoryBlogService from "../Services/CategoryBlogService";

let handleGetAllCategoryBlog = async (request, response) => {
  try {
    let CategoryBlog = await CategoryBlogService.getAllCategoryBlog();
    return response.status(200).json(CategoryBlog);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleCreateCategoryBlog = async (request, response) => {
  try {
    let CategoryBlog = await CategoryBlogService.createCategoryBlog(
      request.body
    );
    return response.status(200).json({
      CategoryBlog,
    });
  } catch (e) {
    return response.status(400).json(e);
  }
};
let handleUpdatCategoryBlog = async (request, response) => {
  try {
    let CategoryBlog = await CategoryBlogService.updateCategoryBlog(
      request.body
    );
    return response.status(200).json({
      CategoryBlog,
    });
  } catch (error) {
    return response.status(500).json(error);
  }
};
let handleDeleteCategoryBlog = async (request, response) => {
  try {
    let CategoryBlogId = request.params.id;
    let CategoryBlog = await CategoryBlogService.deleteCategoryBlog(
      CategoryBlogId
    );
    return response.status(200).json(CategoryBlog);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllCategoryBlog,
  handleCreateCategoryBlog,
  handleUpdatCategoryBlog,
  handleDeleteCategoryBlog,
};
