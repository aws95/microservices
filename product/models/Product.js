const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: String,
        required: true
    },
    productQty: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', ProductSchema);