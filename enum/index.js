const Parameter = {
  Shipper: 1,
  Broker: 2,
  Carrier: 3,
};

const LoadUnit = {
  Kilo: 1,
  Tonnes: 2,
};

const LoadCapacity = {
  HighCapacity: 24000,
  LowCapacity: 2000,
  HeavyCapacity: 25000,
};

const PaymentMethod = {
  Cash: 1,
  CreditCard: 2,
  DebitCard: 3,
  Paypal: 4,
};
const OrderStatus = {
  OrderMade: 1,
  Proceesed: 2,
  Delivered: 3,
};

const Ratings = {
  Bad: 1,
  Good: 2,
  VeryGood: 3,
  Excellent: 4,
};

const TRIP_STATUS = [
  { value: 'NotAssigned', text: 'Not Assigned' },
  { value: 'Assigned', text: 'Assigned' },
  { value: 'Dispatched', text: 'Dispatched' },
  { value: 'PickedUp', text: 'Picked Up Shipment' },
  { value: 'Delivered', text: 'Delivered Shipment' },
  { value: 'Cancelled', text: 'Cancelled Shipment' },
];

module.exports = {
  TRIP_STATUS,
};
