const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqk54.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Assignment12");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");

    // get all products api

    app.get("/allproducts", async (req, res) => {
      const data = productsCollection.find({});
      const result = await data.toArray();
      res.send(result);
    });

    // get only six products api

    app.get("/homeproducts", async (req, res) => {
      const data = productsCollection.find({}).limit(6);
      const result = await data.toArray();

      res.send(result);
    });
    // get single products
    app.get("/singleproducts/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);

      res.send(result);
    });

    // add product api
    app.post("/addproduct", async (req, res) => {
      const data = req.body;
      const result = await productsCollection.insertOne(data);
      res.send(result);

      console.log(result);
    });

    // place order api
    app.post("/placeorder", async (req, res) => {
      const data = req.body;
      const result = await ordersCollection.insertOne(data);
      console.log(result);
    });

    // customers orders by email
    app.get("/userorders/:email", async (req, res) => {
      const email = req.params.email;
      const result = await ordersCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    // manage all orders
    app.get("/allorder", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });

    // order cancle api
    app.delete("/cancleorder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);

      console.log(result);
    });

    console.log("database connected successfully");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Assignment 11!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
