const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    id: String,
    name: String,
  },
  {
    timestamps: true ,
    collection: 'category',
  },
);
const Categories = mongoose.model('category', CategorySchema);
module.exports = Categories;
