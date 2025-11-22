const { responseHandler } = require('../../middleware/responseHandler');
const bookingService = require('../service/bookingService');
const {Types }=require('mongoose')


class BookingController {
  async holdSeats(req, res, next) {
    const { body:{seatIds, eventId} } = req;
    seatIds.forEach((id)=>Types.ObjectId.createFromHexString(id))
    const data = { seatIds, eventId:Types.ObjectId.createFromHexString(eventId) }
    const result = await bookingService.holdSeats(data, next);
    responseHandler(res, result);
  }

  async confirmSeats(req, res, next) {
    const { body:{holdId} } = req;
    const data = { holdId:Types.ObjectId.createFromHexString(holdId)}
    const result = await bookingService.confirmSeats(data, next);
    responseHandler(res, result);
  }

  async cancelBooking(req, res, next) {
    const { body:{bookingId} } = req;
    const data = { bookingId:Types.ObjectId.createFromHexString(bookingId) }
    const result = await bookingService.cancelBooking(data, next);
    responseHandler(res, result);
  }

  async getBooking(req, res, next) {
    const { params:{id} } = req;
    const data = { bookingId:Types.ObjectId.createFromHexString(id) }
    const result = await bookingService.getBooking(data, next);
    responseHandler(res, result);
  }
}

module.exports = new BookingController();
