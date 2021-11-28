const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@cluster0.j2pnz.mongodb.net/rosita?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const db = client.db("rosita");
    const resorts = db.collection("resorts");
    const bookings = db.collection("bookings");

    // adding one resort to db
    app.post("/add-resort", async (req, res) => {
      const data = req.body;
      const result = await resorts.insertOne(data);
      res.send(result);
    });

    // geting all the resort
    app.get("/resorts", async (req, res) => {
      const result = await resorts.find({}).toArray();
      res.json(result);
    });

    // adding bookings
    app.post("/add-booking", async (req, res) => {
      const data = req.body;
      const result = await bookings.insertOne(data);
      res.send(result);
    });

    // get user bookings
    app.get("/bookings/:userid", async (req, res) => {
      const userid = req.params.userid;
      const query = { userId: userid };
      const result = await bookings.find(query).toArray();
      res.json(result);
    });

    // Delete Booking
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookings.deleteOne(query);
      res.send(result);
    });

    //get all of the bookings
    app.get("/bookings", async (req, res) => {
      const result = await bookings.find({}).toArray();
      res.json(result);
    });

    //Update Booking Status
    app.put("/update-status/", async (req, res) => {
      const id = req.query.id;
      const status = req.query.status;
      const filter = { _id: ObjectId(id) };
      const updateDoc = { $set: { status: status } };
      const result = await bookings.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    //   await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("is this working?......... /n O Yeah");
});

app.listen(PORT, () => {
  console.log(`App is Running on Port ${PORT}`);
});
