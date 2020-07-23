const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

//production redis url
let redis_url = process.env.REDIS_URL;
if (process.env.ENVIRONMENT === "development") {
  require("dotenv").config();
  redis_url = "redis://127.0.0.1";
}

//redis setup
let client = require("redis").createClient(redis_url);
let Redis = require("ioredis");
let redis = new Redis(redis_url);
client.on("connect", function() {
  console.log("Redis client connected");
});
client.on("error", (err) => {
  console.log("Error " + err);
});

//////////////////////////
router.get("/", async (req, res) => {
  try {
    let carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const cart = new Cart({
    productId: req.body.productId,
    productName: req.body.productName,
    productPrice: req.body.productPrice,
    productQty: req.body.productQty,
    productImage: req.body.productImage,
    userId: req.body.userId,
  });
  try {
    let savedCart = await cart;
    savedCart.save();
    res.json(savedCart);
  } catch (err) {
    res.json({ message: err });
  }
});

//get specific cart

router.get("/:cartId", (req, res) => {
  try {
    const id = req.params.cartId; //id is unique identifier
    //check if rep details are present in cache
    return client.get(id, async (error, rep) => {
      if (rep) {
        return res.json({ source: "cache", data: JSON.parse(rep) });
      } else {
        let cart = await Cart.findById(req.params.cartId);
        client.set(id, JSON.stringify(cart), (error, result) => {
          if (error) {
            res.status(500).json({ error: error });
          }
        });
        return res.json(cart);
      }
    });
  } catch (err) {
    res.json({ message: err });
  }
});

//delete specific cart

router.delete("/:cartId", (req, res) => {
  try {
    const id = req.params.cartId;
    return client.del(id, async (error, result) => {
      if (error) {
        res.status(500).json({ error: error });
        return;
      } else {
        let removedCart = await Cart.deleteOne({ _id: req.params.cartId });
        res.json(removedCart);
      }
    });
  } catch (err) {
    res.json({ message: err });
  }
});

//update specific cart

router.patch("/:cartId", async (req, res) => {
  try {
    let updatedCart = await Cart.updateOne(
      { _id: req.params.cartId },
      { $set: { title: req.body.status } }
    );
    res.json(updatedCart);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
