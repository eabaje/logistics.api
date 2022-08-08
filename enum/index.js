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

const TRACK_SHIPMENT_STATUS = [
  { value: 'Interested', text: 'Placed Interest' },
  { value: 'NotInterested', text: 'Withdraw Interest' },
  { value: 'RestoredInterest', text: 'Restored Interest' },
  { value: 'NotAssigned', text: 'Not Assigned' },
  { value: 'Assigned', text: 'Assigned Shipment' },
  { value: 'AssignedDriverShipment', text: 'Assigned Driver Shipment' },
  { value: 'Dispatched', text: 'Dispatched Shipment' },
  { value: 'SubmitForPickedUp', text: 'Submit for Picked Up' },
  { value: 'ConfirmPickedUp', text: 'Confirm Picked Up' },
  { value: 'Delivered', text: 'Delivered Shipment' },
  { value: 'ConfirmDelivered', text: 'Confirmed Delivered Delivery' },
  { value: 'Cancelled', text: 'Cancelled Shipment' },
];
const ROLES = [
  { value: 'admin', text: 'Administrator' },
  { value: 'auditor', text: 'Auditor' },
  { value: 'carrier', text: 'Carrier' },
  { value: 'shipper', text: 'Shipper' },
  { value: 'driver', text: 'driver ' },
  { value: 'broker', text: 'Broker' },
];
module.exports = {
  TRIP_STATUS,
  ROLES,
  TRACK_SHIPMENT_STATUS,
};
