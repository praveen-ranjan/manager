const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const hotelCheckinSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId },
    hotelId: { type: ObjectId },
    placeId: { type: String },
    refNumber: { type: String },
    isCheckinApprove: { type: Number, default: 0 }, // 0 for pending,  1-approved,  2-  for disapproved
    isDeleted: { type: Number, default: 0 },
    isDraft: { type: Number, default: 0 },
    arrival: {
      date: { type: Date },
      hour: { type: Number },
      minute: { type: Number }
    },
    departure: {
      date: { type: Date },
      hour: { type: Number },
      minute: { type: Number }
    },
    status: { type: Boolean, default: true },
    approveDate: { type: Date },
    disapproveDate: { type: Date },
    bookingStatus: { type: Number }, // 0 for RESERVED, 1- DUE IN , 2-CANCELLED, 3 - CHECKED IN, 4 - CHECKED OUT
    propertyType: { type: String },
    roomTypeCat: { type: String },
    propertyType: { type: String },
    roomNo: [{ type: ObjectId }]
  },
  { collection: "hotel_checkin" }
);

exports.FrontDesk = mongoose.model("FrontDesk", hotelCheckinSchema);
