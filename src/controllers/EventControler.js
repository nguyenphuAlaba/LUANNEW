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
module.exports = {
  handleCreateEvent,
};
