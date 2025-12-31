const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
   { productId:  {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }},
    {    id: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
    }
)

orderSchema.virtual('getUrl').get(function() {
    return `http://localhost:3000/orders/${this._id}`
})


orderSchema.virtual('getProduct').get(function() {
    return `http://localhost:3000/products/${this.productId}`
})

module.exports = mongoose.model('Order', orderSchema)