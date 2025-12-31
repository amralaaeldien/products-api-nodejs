const express = require('express');
const router = express.Router();
const Product = require('../ models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname )
    }
})
const upload = multer({storage});



router.get('/', async (req, res) => {
    try {
        let products = await Product.find().select('name price productImage').exec();
        // products = products.map(function(prod) {
        //     return prod.toJSON({virtuals:false})
        // })
        res.status(200).json({
            count: products.length,
            products
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: e.message
        })
    }
});

router.post('/', upload.single('productImage'), checkAuth, (req, res) => {
    console.log(req.file)
    let product = {
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    }

    product = new Product(product);
    product.save()
        .then(result => console.log(result))
        .catch(err => console.log(err))

    res.status(200).json({
        message: 'handling post request for /products',
        createdProduct: product
    });
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    let product;
    try {
        product = await Product.findById(id).exec();
        res.status(200).json({
            product: product
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: e.message
        })
    }
});

router.delete('/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    try {
        await Product.findByIdAndDelete(id).exec();
        res.status(200).json({
            message: 'deleted succressfully'
        })
    } catch (e){
        console.log(e)
        res.status(500).json({error: e})
    }
});

router.patch('/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    // let product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }
    // if (!product.name){
    //     delete product.name
    // }
    // if(!product.price) {
    //     delete product.price
    // }
    let product = {...req.body}
    try{
        product = await Product.findByIdAndUpdate(id, {$set:product}, {new: true});
        res.status(200).json({
            message: 'updated successfully',
            product
        })
    }catch(e) {
        res.json({
            error: e
        })
    }

});

module.exports = router;