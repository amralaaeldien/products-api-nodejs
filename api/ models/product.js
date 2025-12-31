const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
}, {
    id: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

productSchema.virtual('getUrl').get(function() {
    return `http://localhost:3000/products/${this._id}`
})

module.exports = mongoose.model('Product', productSchema)