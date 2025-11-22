const AVAILABLE = 'Available',
  RESERVED = 'Reserved',
  BOOKED = 'Booked',
  CANCELED = 'Canceled';
((PENDING = 'Pending'), (CONFIRMED = 'Confirmed'), (FAILED = 'Failed'));

const status = {
  AVAILABLE: AVAILABLE,
  RESERVED: RESERVED,
  BOOKED: BOOKED,
  CANCELED: CANCELED,
  PENDING: PENDING,
  CONFIRMED: CONFIRMED,
  FAILED: FAILED,
};
const statusEnums = [
  AVAILABLE,
  CANCELED,
  RESERVED,
  BOOKED,
  CONFIRMED,
  PENDING,
  FAILED,
];

module.exports = {
  status,
  statusEnums,
};
