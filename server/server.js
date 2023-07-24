const express = require("express");

const app = express();

const dotenv = require("dotenv");
const cors = require("cors");

const mongodb = require("./mongo");

const userRoutes = require("./User.js");
const s3Routes = require("./S3.js");

dotenv.config();

//Intializing database
mongodb();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("works");
});

app.use("/user", userRoutes);
app.use("/images", s3Routes);

app.listen("4000", () => {
  console.log("Server running on 4000");
});
