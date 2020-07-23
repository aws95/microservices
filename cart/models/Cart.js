const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
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
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Cart', CartSchema);