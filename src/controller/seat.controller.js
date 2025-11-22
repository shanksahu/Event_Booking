const { responseHandler } = require('../../middleware/responseHandler');
const seatService = require('../service/seatService');
const {Types }=require('mongoose')

class SeatController {
  async getSeatsByEvent(req, res, next) {
    let { params: { eventId }, query:{limit=10, pageNo=1} } = req;
     pageNo = pageNo?parseInt(pageNo):1
    const data = {
      limit:limit?parseInt(limit):10,
      skip : (pageNo - 1) * parseInt(limit),
      pageNo:pageNo,
      eventId: Types.ObjectId.createFromHexString(eventId)
    }
    const result = await seatService.getSeatsByEvent(data, next);
    responseHandler(res, result);
  }
}

module.exports = new SeatController();
