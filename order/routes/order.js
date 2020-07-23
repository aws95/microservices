const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
    try {
        let orders = await Order.find();
        res.json(orders);
    }
    catch (err) {
        res.json({message: err});
    }
});


router.post('/', async (req, res) => {
    const order = new Order({
        orderId: req.body.orderId,
        cartId: req.body.cartId,
        userId: req.body.userId,
    });
    try {
        let savedOrder = await order;
        savedOrder.save();
        res.json(savedOrder);
    }
    catch (err) {
        res.json({message: err});
    }
});

//get specific order

router.get("/:orderId", (req, res) => {
    try {
      const id = req.params.orderId; //id is unique identifier
      //check if rep details are present in cache
      return client.get(id, async (error, rep) => {
        if (rep) {
          return res.json({ source: "cache", data: JSON.parse(rep) });
        } else {
          let order = await Order.findById(req.params.orderId);
          client.set(id, JSON.stringify(order), (error, result) => {
            if (error) {
              res.status(500).json({ error: error });
            }
          });
          return res.json(order);
        }
      });
    } catch (err) {
      res.json({ message: err });
    }
  });

//delete specific order 

router.delete("/:orderId", (req, res) => {
    try {
      const id = req.params.orderId;
      return client.del(id, async (error, result) => {
        if (error) {
          res.status(500).json({ error: error });
          return;
        } else {
          let removedOrder = await Order.deleteOne({ _id: req.params.orderId });
          res.json(removedOrder);
        }
      });
    } catch (err) {
      res.json({ message: err });
    }
  });

//update specific order 

router.patch('/:orderId', async (req, res) => {
 
    try {
        let updatedOrder = await Order.updateOne({_id: req.params.orderId}, {$set:{title: req.body.status}});
        res.json(updatedOrder);
    }
    catch (err) {
        res.json({message: err});
    }
});

module.exports = router;