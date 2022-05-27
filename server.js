const express = require("express");
const mongoose = require("mongoose");
const {config} = require('dotenv')
const barangRouter = require("./routes/barangRoutes.js");
config()

const app = express();

app.use(express.json());

const param = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

const uri = process.env.MONGO_URI

app.use('/barang', barangRouter);

mongoose.connect(uri, param);

mongoose.connection.once("open", () => {
  console.log("connected to database");
  app.listen(3000, () => {
    console.log("Server is running...");
  });
});

mongoose.connection.on("error", (err) => {
  console.log("Error:", err);
  process.exit(1);
});

