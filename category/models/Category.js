const mongoose = require('mongoose');

const CartegorySchema = mongoose.Schema({
    categoryId: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Cartegory', CartegorySchema);