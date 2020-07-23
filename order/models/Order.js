const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    cartId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Order', OrderSchema);