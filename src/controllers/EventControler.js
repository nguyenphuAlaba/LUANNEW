import db from "../models/index";
import EventService from "../Services/EventService";

let handleCreateEvent = async (request, response) => {
  try {
    let Event = await EventService.createEvent(request.body);
    return response.status(200).json(Event);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleUpdateEvent = async (request, response) => {
  try {
    let Event = await EventService.updateEvent(request.body);
    return response.status(200).json(Event);
  } catch (error) {
    return response.status(400).json(error);
  }
};
let handleDeleteEvent = async (request, response) => {
  try {
    let id = request.params.eventId;
    let event = await EventService.deleteEvent(id);
    return response.status(200).json(event);
  } catch (error) {
    return response.status(400).json(error);
  }
};
module.exports = {
  handleCreateEvent,
  handleUpdateEvent,
  handleDeleteEvent,
};
