const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
    required: true
  }
},
  {
    timestamps: true
  })

const Product = mongoose.model('product', ProductSchema);
module.exports = Product;