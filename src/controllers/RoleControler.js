import db from "../models/index";
import RoleService from "../Services/RoleService";

let handleGetAllRole = async (request, response) => {
  try {
    let role = await RoleService.getAllRole();
    return response.status(200).json(role);
  } catch (e) {
    response.status(500).json(e);
  }
};
let handleGetUserByRole = async (request, response) => {
  try {
    let role_id = request.params.id;
    let role = await RoleService.getUserByIdRole(role_id);
    response.status(200).json(role);
  } catch (error) {
    response.status(400).json(error);
  }
};
let handleCreateRole = async (request, response) => {
  try {
    let role = await RoleService.createRole(request.body);
    return response.status(200).json(role);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handlDeleteRole = async (request, response) => {
  try {
    let id = await request.params.id;
    let role = await RoleService.deleteRole(id);
    return response.status(200).json(role);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleGetAllRole,
  handleGetUserByRole,
  handleCreateRole,
  handlDeleteRole,
};
