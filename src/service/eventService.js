const { status } = require('../../enums/constants.enums');
const { responseStructure } = require('../../middleware/responseHandler');
const {eventModel, seatAvailabilityModel} = require('../model/index');
const moment = require('moment')

class EventService {
  async createEvent(data, next) {
    try {
      const event = await eventModel.create(data);
      if(!event){
        return responseStructure(409,false, "Unable to create")
      }
      this.addSeats(event)
      return responseStructure(200,true,"Event created",event)
    } catch (error) {
      next(error);
    }
  }

  async addSeats (eventData) {
  const { _id, totalSeats } = eventData;

  const batchSize = 200;
  let start = 1;
    try {
       while (start <= totalSeats) {
    const seats = [];

    for (let i = start; i < start + batchSize && i <= totalSeats; i++) {
      seats.push({
        seatNumber: i,
        eventId:_id,
      });
    }
    await seatAvailabilityModel.insertMany(seats, { ordered: false });
    start += batchSize;
  }
    } catch (error) {
      console.log("Seat adding error :-",error)
      // track error
    }
};

  async getAllEvents(data, next) {
    try {
      let {skip, limit, pageNo} = data
      let findObj = {status:"Active"}
     const query = [
        {$match:findObj},
        {$project:{
          eventName:1,
          eventDate:1,
          totalSeats:1,
          bookingAmount:1,
        }},
        {$facet:{
          data:[
            { $sort: { createdAt: -1 } },
            {$skip: skip},
            {$limit: limit}
          ],
          totalCount:[
           { $count:"count"}
          ]
        }},
       {
        $project: {
          data: 1,
          pagination: {
            $let: {
              vars: { total: { $arrayElemAt: ["$totalCount.count", 0] } },
              in: {
                totalCount: { $ifNull: ["$$total", 0] },
                totalPages: {
                  $ceil: { $divide: [{ $ifNull: ["$$total", 0] }, limit] }
                },
                currentPage: pageNo,
                hasNext: {
                  $lt: [skip + limit, { $ifNull: ["$$total", 0] }]
                },
                hasPrev: { $gt: [pageNo, 1] }
              }
            }
          }
        }
      }
      ];

       const [events] = await eventModel.aggregate(query, {
        allowDiskUse: true,
        collation: { locale: "en" }
      })
      return responseStructure(200, true, "Events list fetched", events);
    } catch (error) {
      next(error);
    }
  }

  async getEventById(data, next) {
    try {
      const project={
        eventName:1,
        eventDate:1,
        location:1,
        totalSeats:1,
        bookingAmount:1,
        availableSeatsCount:1,
        totalBookedSeatsCount:1,
        heldSeatsCount:1,
      }
      const query = [
        {$match:{_id:data.eventId, isDeleted:false}},
        {$lookup: {
          from: 'seatavailabilities',
          localField: '_id',
          foreignField: 'eventId',
          as: 'seats'
        }},
        {$addFields: {
          availableSeatsCount: {
            $size: {
              $filter: {
                input: '$seats',
                as: 'seat',
                cond: { $eq: ['$$seat.status', status.AVAILABLE] }
              }
            }
          },
           heldSeatsCount: {
            $size: {
              $filter: {
                input: '$seats',
                as: 'seat',
                cond: { $eq: ['$$seat.status', status.RESERVED] }
              }
            }
          },
           totalBookedSeatsCount: {
            $size: {
              $filter: {
                input: '$seats',
                as: 'seat',
                cond: { $eq: ['$$seat.status', status.BOOKED] }
              }
            }
          },
        }},
        {$project:project},
      ];

       const [event] = await eventModel.aggregate(query, {
        allowDiskUse: true,
        collation: { locale: "en" }
      })
      if (!event) {
        return responseStructure(404, false, "Event not found");
      }
      return responseStructure(200, true, "Event details fetched", event);
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(data, next) {
    try {
      const eventDetails = await eventModel.findOne({_id:data.eventId, isDeleted:false})
        if (!eventDetails) {
        return responseStructure(404, false, "Event not found");
      }
      const upComingDate = moment(data.eventDate);
      const eventDate = moment(eventDetails.eventDate);
      const today = moment().startOf('day');
      if (!moment(upComingDate).isSame(moment(eventDate), "day")) {
        if (upComingDate.isBefore(today)) {
           return responseStructure(409, false, "Event date must be today or in the future");
      }
    }
      const event = await eventModel.findByIdAndUpdate(data.eventId, data, { new: true });
     
      return responseStructure(200, true, "Event updated", event);
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(data, next) {
    try {
      const updateObject = {status:"Deleted", isDeleted:true}
      const event = await eventModel.findOneAndUpdate({_id:data.eventId,isDeleted:false}, updateObject);
      if (!event) {
        return responseStructure(404, false, "Event not found");
      }
      return responseStructure(200, true, "Event deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventService();
