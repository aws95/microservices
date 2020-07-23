const express = require("express");
const router = express.Router();
const Cartegory = require("../models/Category");
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
router.get("/", async (req, res) => {
  try {
    let cartegories = await Cartegory.find();
    res.json(cartegories);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const cartegory = new Cartegory({
    categoryId: req.body.categoryId,
    categoryName: req.body.categoryName,
  });
  try {
    let savedCartegory = await cartegory;
    savedCartegory.save();
    res.json(savedCartegory);
  } catch (err) {
    res.json({ message: err });
  }
});

//get specific cartegory

router.get("/:cartegoryId", (req, res) => {
  try {
    const id = req.params.categoryId; //id is unique identifier
    //check if rep details are present in cache
    return client.get(id, async (error, rep) => {
      if (rep) {
        return res.json({ source: "cache", data: JSON.parse(rep) });
      } else {
        let category = await Cartegory.findById(req.params.categoryId);
        client.set(id, JSON.stringify(category), (error, result) => {
          if (error) {
            res.status(500).json({ error: error });
          }
        });
        return res.json(category);
      }
    });
  } catch (err) {
    res.json({ message: err });
  }
});

//delete specific cartegory

router.delete("/:cartegoryId", (req, res) => {
  try {
    const id = req.params.cartegoryId;
    return client.del(id, async (error, result) => {
      if (error) {
        res.status(500).json({ error: error });
        return;
      } else {
        let removedCartegory = await Cartegory.deleteOne({
          _id: req.params.cartegoryId,
        });
        res.json(removedCartegory);
      }
    });
  } catch (err) {
    res.json({ message: err });
  }
});

//update specific cartegory

router.patch("/:cartegoryId", async (req, res) => {
  try {
    let updatedCartegory = await Cartegory.updateOne(
      { _id: req.params.cartegoryId },
      { $set: { title: req.body.status } }
    );
    res.json(updatedCartegory);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
