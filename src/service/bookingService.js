const {seatAvailabilityModel,eventModel, bookingModel} = require('../model/index');
const mongoose = require('mongoose');
const moment = require('moment');
const { responseStructure } = require('../../middleware/responseHandler');
const { status } = require('../../enums/constants.enums');

class BookingService {
  async holdSeats(data, next) {
    const session = await seatAvailabilityModel.startSession();
    let transactionStarted = false;
    try {
      const { seatIds, eventId } = data;
      const holdId = new mongoose.Types.ObjectId();
      const holdExpireTime = moment().add(5, 'minutes').toDate();

      // Check if all seats are available
      const seats = await seatAvailabilityModel.find({ _id: { $in: seatIds }, eventId });
      if(!seats.length){
          return responseStructure(409, false, 'Seat is not available');
      }
      for (const seat of seats) {
        if (seat.isBooked || seat.isHold ) {
          return responseStructure(400, false, `Seat number ${seat.seatNumber} is not available`);
        }
      }

      session.startTransaction();
      transactionStarted = true
      // Update seats with hold
      let reservingSeat = await seatAvailabilityModel.updateMany(
        { _id: { $in: seatIds }, isHold:false, isBooked:false},
        {
          holdId,
          holdExpireTime,
          isHold: true,
          status: status.RESERVED
        },
        { session, new: true }
      );
      console.log(eventId)
      // Add booking
      let bookingData={
        seatIds,
        eventId,
        holdId,
      }
      const initiateBooking = await bookingModel.create([bookingData],{ session})

      if(!initiateBooking || reservingSeat.modifiedCount===0){
        await session.abortTransaction();
        session.endSession();
        return responseStructure(409, false, 'Seat is not available');
      }
      await session.commitTransaction();
      session.endSession();
      return responseStructure(200, true, 'Seats held successfully', { holdId });
    } catch (error) {
       if (transactionStarted) {
        await session.abortTransaction();
      }
      session.endSession();
      next(error);
    }
  }

  async confirmSeats(data, next) {
    const session = await seatAvailabilityModel.startSession();
    let transactionStarted = false;
    try {
      const { holdId } = data;
      const now = new Date();

      // Find seats with the holdId 
      const seats = await seatAvailabilityModel.find({ holdId, isHold:true, status: status.RESERVED });
      if (seats.length === 0) {
        return responseStructure(400, false, 'Booking failed!');
      }

      const event = await eventModel.findById(seats[0].eventId)
      let totalBookingAmount = (seats.length*event.bookingAmount)
       // Confirm booking
      let bookingData={
        holdId:null,
        bookingStatus:status.CONFIRMED,
        amount:totalBookingAmount,
        bookingDate:new Date()
      }
      session.startTransaction();
      transactionStarted = true
      let bookingDetails = await bookingModel.findOneAndUpdate({holdId}, bookingData,{ session, new: true })

      // Confirm booking to the seat
      let reservedSeat = await seatAvailabilityModel.updateMany(
       { holdId, isHold:true },
        {
          bookedDateAndTime: now,
          holdId: null,
          holdExpireTime: null,
          isHold: false,
          status: status.BOOKED,
          amount:event.bookingAmount,
          bookingId:bookingDetails._id,
          isBooked:true
        },
        { session, new: true }
      );

      if(!bookingDetails || reservedSeat.modifiedCount===0){
        await session.abortTransaction();
        session.endSession();
        bookingData.bookingStatus = status.FAILED
        await bookingModel.findOneAndUpdate({holdId}, bookingData)
        return responseStructure(409, false, 'Booking failed!');
      }

      await session.commitTransaction();
      session.endSession();
      
      return responseStructure(200, true, 'Seats booked successfully',{bookingId:bookingDetails._id});
    } catch (error) {
      if (transactionStarted) {
        await session.abortTransaction();
      }
      session.endSession();
      next(error);
    }
  }

  async cancelBooking(data, next) {
    const session = await seatAvailabilityModel.startSession();
    try {
      const { bookingId} = data;
      let findObject =  { bookingId, isBooked: true, status: status.BOOKED }

      // Update seats to available status if booking is valid
      session.startTransaction();
      const makeSeatAvailable = await seatAvailabilityModel.updateMany(
       findObject,
        { status:status.AVAILABLE,bookingId:null, isBooked:false },
        { session, new: true }
      );
      let bookingCanceled = await bookingModel.findByIdAndUpdate(
        bookingId,
        {bookingStatus:status.CANCELED},
        { session, new: true }
      )

      if(!bookingCanceled || makeSeatAvailable.modifiedCount===0){
        await session.abortTransaction();
        session.endSession();
        return responseStructure(409, false, 'Unable to cancel booking');
      }
      await session.commitTransaction();
      session.endSession();

      return responseStructure(200, true, 'Booking canceled successfully');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  async getBooking(data, next) {
    try {
      const { bookingId} = data;
      let project={
        seatIds:1,
        eventId:1,
        amount:1,
        bookingStatus:1,
        bookingDate:1
      }
       let bookingDetails = await bookingModel.findById(bookingId,project).populate('seatIds eventId','seatNumber eventName eventDate location')
       if(!bookingDetails){
          return responseStructure(409, false, 'Booking details are not available');
       }
      return responseStructure(200, true, 'Booking details fetched',{bookingDetails});
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new BookingService();
