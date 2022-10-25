import db from "../models/index";
import BlogService from "../Services/BlogService";

let handleGetAllBlog = async (request, response) => {
  try {
    let Blog = await BlogService.getAllBlog();
    response.status(200).json(Blog);
  } catch (error) {
    response.status(400).json(error);
  }
};
let handleGetAllBlogByCategory = async (request, response) => {
  try {
    let catId = await request.params.id;
    let Blog = await BlogService.getAllBlogByCategory(catId);
    response.status(200).json(Blog);
  } catch (error) {
    response.status(400).json(error);
  }
};
let handleCreateBlog = async (request, response) => {
  try {
    let Blog = await BlogService.createBlog(request.body);
    response.status(200).json(Blog);
  } catch (error) {
    response.status(400).json(error);
  }
};
let handleUpdateBlog = async (request, response) => {
  try {
    let Blog = await BlogService.updateBlog(request.body);
    response.status(200).json(Blog);
  } catch (error) {
    response.status(400).json(error);
  }
};
let handleDeleteBlog = async (request, response) => {
  try {
    let blogid = await request.params.id;
    let blog = await BlogService.deleteBlog(blogid);
    response.status(200).json(blog);
  } catch (error) {
    response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllBlog,
  handleCreateBlog,
  handleGetAllBlogByCategory,
  handleUpdateBlog,
  handleDeleteBlog,
};
