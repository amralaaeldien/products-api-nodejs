const express = require('express');
const router = express.Router();
const Order = require('../ models/orders');
const Product = require('../ models/product');
const checkAuth = require('../middleware/check-auth')


router.get('/', checkAuth, async (req, res) => {
    try {
        let orders = await Order.find();
        res.status(200).json({
            count: orders.length,
            orders
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: e
        })
    }
});

router.post('/', checkAuth,async (req, res) => {
    let order = {
        productId: req.body.productId,
        quantity: req.body.quantity 
    }

    let product = await Product.findById(order.productId);

    try{
        if(product) {
            order = new Order(order);
            await order.save();
            res.status(201).json({
                order
            })
        } else {
            throw new Error('no such product')
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: e.message
        })
    }
});

router.get('/:id', checkAuth, async (req, res) => {
    try{
        let order = await Order.findById(req.params.id).populate('productId');
        if(order) {
            res.status(200).json({
                order
            })
        } else {
            res.status(404).json({
                error: 'order not found'
            })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({
            error: e.message
        })
    }
});

router.delete('/:id', checkAuth,async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: 'deleted successfully'
        })
    } catch(e) {
        res.status(500).json({
            error: e.message
        })
    }
});

module.exports = router;