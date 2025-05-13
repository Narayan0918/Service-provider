// const mongoose = require('mongoose');

// const CitySchema = new mongoose.Schema(
//   {
//     id: String,
//     city: String,
//     state: String,
//     country: String,
//   },
//   {
//     timestamp: true,
//     collection: 'cities',
//   },
// );
// const Cities = mongoose.model('city', CitySchema);
// module.exports = Cities;

const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // <- fixed typo: should be "timestamps", not "timestamp"
    collection: 'cities',
  }
);

const Cities = mongoose.model('city', CitySchema);
module.exports = Cities;