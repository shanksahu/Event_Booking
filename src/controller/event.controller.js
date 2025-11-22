const { responseHandler } = require('../../middleware/responseHandler');
const eventService = require('../service/eventService');
const {Types }=require('mongoose')

class EventController {
  async createEvent(req, res, next) {
    const { body: { eventName,bookingAmount, eventDate, location, totalSeats } } = req;
    const data = { eventName, eventDate:new Date(eventDate), location,bookingAmount, totalSeats };
    const result = await eventService.createEvent(data, next);
    responseHandler(res, result);
  }

  async getAllEvents(req, res, next) {
    let {query:{limit=10, pageNo=1}}= req
    pageNo = pageNo?parseInt(pageNo):1
    const data = {
      limit:limit?parseInt(limit):10,
      skip : (pageNo - 1) * parseInt(limit),
      pageNo:pageNo
    }
    const result = await eventService.getAllEvents(data,next);
    responseHandler(res, result);
  }

  async getEventById(req, res, next) {
    const { params:{id}} = req;
    const data = {eventId: Types.ObjectId.createFromHexString(id)}
    const result = await eventService.getEventById(data, next);
    responseHandler(res, result);
  }

  async updateEvent(req, res, next) {
    const { params:{id},body: { eventName,bookingAmount, eventDate, location } } = req;
    const data = {eventName,bookingAmount, eventDate, location,eventId: Types.ObjectId.createFromHexString(id)}
   
    const result = await eventService.updateEvent(data, next);
    responseHandler(res, result);
  }

  async deleteEvent(req, res, next) {
     const { params:{id}} = req;
     const data = {
      eventId: Types.ObjectId.createFromHexString(id)
     }
    const result = await eventService.deleteEvent(data, next);
    responseHandler(res, result);
  }
}

module.exports = new EventController();
