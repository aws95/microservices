const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        let products = await Product.find();
        res.json(products);
    }
    catch (err) {
        res.json({message: err});
    }
});


router.post('/', async (req, res) => {
    const product = new Product({
        productId: req.body.productId,
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productQty: req.body.productQty,
        productImage: req.body.productImage,
    });
    try {
        let savedProduct = await product;
        savedProduct.save();
        res.json(savedProduct);
    }
    catch (err) {
        res.json({message: err});
    }
});

//get specific product

router.get("/:productId", (req, res) => {
    try {
      const id = req.params.productId; //id is unique identifier
      //check if rep details are present in cache
      return client.get(id, async (error, rep) => {
        if (rep) {
          return res.json({ source: "cache", data: JSON.parse(rep) });
        } else {
          let product = await Product.findById(req.params.productId);
          client.set(id, JSON.stringify(product), (error, result) => {
            if (error) {
              res.status(500).json({ error: error });
            }
          });
          return res.json(product);
        }
      });
    } catch (err) {
      res.json({ message: err });
    }
  });

//delete specific bug 

router.delete("/:productId", (req, res) => {
    try {
      const id = req.params.productId;
      return client.del(id, async (error, result) => {
        if (error) {
          res.status(500).json({ error: error });
          return;
        } else {
          let removedProduct = await Product.deleteOne({ _id: req.params.productId });
          res.json(removedProduct);
        }
      });
    } catch (err) {
      res.json({ message: err });
    }
  });


//update specific bug 

router.patch('/:productId', async (req, res) => {
 
    try {
        let updatedProduct = await Product.updateOne({_id: req.params.productId}, {$set:{title: req.body.status}});
        res.json(updatedProduct);
    }
    catch (err) {
        res.json({message: err});
    }
});

module.exports = router;