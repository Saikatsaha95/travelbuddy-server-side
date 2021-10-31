const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.loxap.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to database");
    const database = client.db("TourBuddy");
    const serviceCollections = database.collection("services");
    const ordersCollection = database.collection("orders");

    //GET API
    app.get("/services", async (req, res) => {
      console.log("Reading the service data");
      const cursor = serviceCollections.find({});
      const allServices = await cursor.toArray();
      res.json(allServices);
    });

    //GET SINGLE SERVICE
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Getting the service data of ", id);
      const query = { _id: ObjectId(id) };
      const result = await serviceCollections.findOne(query);
      res.json(result);
    });

    //SERVICE POST API
    app.post("/addservices", async (req, res) => {
      const service = req.body;
      const result = await serviceCollections.insertOne(service);
      console.log("Hit the post");
      res.json(result);
    });

    //UPDATE API
    app.put("/service/:id", async (req, res) => {
      const id = req.params.id;
      console.log("updating service ", id);
      updatedService = req.body;
      console.log(updatedService);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedService.name,
          price: updatedService.price,
          shortDescription: updatedService.shortDescription,
          detailsDescription: updatedService.detailsDescription,
          cardImg: updatedService.cardImg,
          bannerImg: updatedService.bannerImg,
        },
      };
      const result = await serviceCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //DELETE API
    // ===========================ORDER SECTION============================

    //GET API
    app.get("/orders", async (req, res) => {
      console.log("Reading the orders data");
      const cursor = ordersCollection.find({});
      const allOrders = await cursor.toArray();
      res.send(allOrders);
    });

    //POST API
    app.post("/orders", async (req, res) => {
      console.log("posting order");
      const order = req.body;
      console.log(order);
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    //UPDATE API
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      console.log("updating order ", id);
      updatedOrder = req.body;
      console.log(updatedOrder);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedOrder.status,
        },
      };
      const result = await ordersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //DELETE API
    app.delete("/orders/:id", async (req, res) => {
      console.log("Deleteting the product");
      const id = req.params.id;
      console.log("This product id is ", id);
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await ordersCollection.deleteOne(query);
      console.log(result);

      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("This is traveral site server");
});

app.listen(port, () => {
  console.log("Listening to the port ", port);
});
