import db from "../models/index";
import CommentblogService from "../Services/CommentblogService";

let handleGetAllCommentblogOfProductRate = async (request, response) => {
  try {
    let product = request.params.id;
    console.log("id: " + product);
    let Commentblog = await CommentblogService.getAllCommentblogOfProductRate(
      product
    );
    return response.status(200).json(Commentblog);
  } catch (e) {
    response.status(400).json(e);
  }
};
let handleAddCommentblog = async (request, response) => {
  try {
    let Commentblog = await CommentblogService.addCommentblog(request.body);
    return response.status(200).json(Commentblog);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateCommentblog = async (request, response) => {
  try {
    let Commentblog = await CommentblogService.updateCommentblog(request.body);
    return response.status(200).json(Commentblog);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteCommentBlog = async (request, response) => {
  try {
    let id = request.params.id;
    let Commentblog = await CommentblogService.deleteCommentBlog(id);
    return response.status(200).json(Commentblog);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllCommentblogOfProductRate,
  handleUpdateCommentblog,
  handleAddCommentblog,
  handleDeleteCommentBlog,
};
