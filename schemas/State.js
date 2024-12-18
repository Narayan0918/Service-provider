const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema(
  {
    id: String,
    
    state: String,
  },
  {
    timestamps: true ,
    collection: 'state',
  },
);
const States = mongoose.model('state', StateSchema);
module.exports = States;
