const { seatAvailabilityModel, eventModel } = require('../model/index');
const { responseStructure } = require('../../middleware/responseHandler');

class SeatService {
  async getSeatsByEvent(data, next) {
    try {
      let { skip, eventId, limit, pageNo } = data;
      const event = await eventModel.findOne(
        { _id: eventId, isDeleted: false },
        { _id: 1 }
      );
      if (!event) {
        return responseStructure(404, false, 'Event not found');
      }
      const query = [
        { $match: { eventId: eventId } },
        {
          $project: {
            seatNumber: 1,
            isHold: 1,
            holdId: 1,
            status: 1,
            isBooked: 1,
            eventId: 1,
            bookingId: 1,
          },
        },
        {
          $facet: {
            data: [
              { $sort: { seatNumber: 1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            data: 1,
            pagination: {
              $let: {
                vars: { total: { $arrayElemAt: ['$totalCount.count', 0] } },
                in: {
                  totalCount: { $ifNull: ['$$total', 0] },
                  totalPages: {
                    $ceil: { $divide: [{ $ifNull: ['$$total', 0] }, limit] },
                  },
                  currentPage: pageNo,
                  hasNext: {
                    $lt: [skip + limit, { $ifNull: ['$$total', 0] }],
                  },
                  hasPrev: { $gt: [pageNo, 1] },
                },
              },
            },
          },
        },
      ];

      const [seats] = await seatAvailabilityModel.aggregate(query, {
        allowDiskUse: true,
        collation: { locale: 'en' },
      });
      return responseStructure(200, true, 'Events list fetched', seats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SeatService();
