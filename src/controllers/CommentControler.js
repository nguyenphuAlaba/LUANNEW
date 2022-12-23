import { request, response } from "express";
import db from "../models/index";
import CommentService from "../Services/CommentService";

let handleGetAllCommentOfProductRate = async (request, response) => {
  try {
    let product = request.params.id;
    console.log("id: " + product);
    let Comment = await CommentService.getAllCommentOfProductRate(product);
    return response.status(200).json(Comment);
  } catch (e) {
    response.status(500).json(e);
  }
};
let handleAddComment = async (request, response) => {
  try {
    let Comment = await CommentService.addComment(request.body);
    return response.status(200).json(Comment);
  } catch (error) {
    return response.status(500).json(error);
  }
};
let handleUpdateComment = async (request, response) => {
  try {
    let Comment = await CommentService.updateComment(request.body);
    return response.status(200).json(Comment);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteComment = async (request, response) => {
  try {
    let commentId = request.params.id;
    let comment = await CommentService.deleteComment(commentId);
    return response.status(200).json(comment);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllComment = async (request, response) => {
  try {
    let product = await CommentService.getAllComment();
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetCommentCustomer = async (request, response) => {
  try {
    let id = request.params.cusId;
    let Comment = await CommentService.getCommentCustomer(id);
    return response.status(200).json(Comment);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleCreateCommentResponse = async (request, response) => {
  try {
    let Comment = await CommentService.createCommentResponse(request.body);
    return response.status(200).json(Comment);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllCommentResponses = async (request, response) => {
  try {
    let id = request.params.commentId;
    let CommentRes = await CommentService.getAllCommentResponses(id);
    return response.status(200).json(CommentRes);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateCommentResponse = async (request, response) => {
  try {
    let Comment = await CommentService.updateCommentResponse(request.body);
    return response.status(200).json(Comment);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteCommentResponse = async (request, response) => {
  try {
    let id = request.params.commentId;
    let Comment = await CommentService.deleteCommentResponse(id);
    return response.status(200).json(Comment);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleGetAllCommentResponsesAdmin = async (request, respone) => {
  try {
    let Comment = await CommentService.getAllCommentResponsesAdmin();
    return respone.status(200).json(Comment);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllCommentOfProductRate,
  handleUpdateComment,
  handleAddComment,
  handleDeleteComment,
  handleGetAllComment,
  handleGetCommentCustomer,
  handleCreateCommentResponse,
  handleGetAllCommentResponses,
  handleUpdateCommentResponse,
  handleDeleteCommentResponse,
  handleGetAllCommentResponsesAdmin,
};
