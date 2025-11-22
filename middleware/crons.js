const cron = require('node-cron');
const { seatAvailabilityModel } = require('../src/model/index');
const { status } = require('../enums/constants.enums');

class CronJobs {
  static startCronJobs() {
    // Run every minute
    cron.schedule('* * * * *', async () => {
      try {
        const now = new Date();
        // Update expired seats to remove hold
        await seatAvailabilityModel.updateMany(
          {
            holdExpireTime: { $lte: now },
            isHold: true,
            isBooked: false,
          },
          {
            holdId: null,
            holdExpireTime: null,
            isHold: false,
            status: status.AVAILABLE,
          }
        );
      } catch (error) {
        console.error('Error in cron job for removing expired holds:', error);
      }
    });
  }
}

module.exports = CronJobs;
