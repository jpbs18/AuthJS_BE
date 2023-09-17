const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router");
const cors = require("cors");


const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json({ type: "*/*" }));

router(app);

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on port ${port}`));