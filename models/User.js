const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32
    },
    address: {
      type: String,
      maxlength: 32
    },
    phone: {
      type: Number,
      max: 9999999999,
      required: true
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Booking'
      }
    ]
  }
);

module.exports = mongoose.model("User", userSchema);