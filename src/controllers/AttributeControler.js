import { response } from "express";
import db from "../models/index";
import AttributeService from "../Services/AttributeService";

let handleCreateAtribute = async (request, response) => {
  try {
    let attribute = await AttributeService.createAtribute(request.body);
    return response.status(200).json(attribute);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateAttribute = async (request, response) => {
  try {
    let attribute = await AttributeService.updateAttribute(request.body);
    return response.status(200).json(attribute);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteAttribute = async (request, response) => {
  try {
    let id = await request.params.id;
    let attribute = await AttributeService.deleteAttribute(id);
    return response.status(200).json(attribute);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleCreateAtribute,
  handleUpdateAttribute,
  handleDeleteAttribute,
};
