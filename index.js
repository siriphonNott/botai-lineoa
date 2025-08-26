const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4100;

app.use(express.json());

// CORS
app.use(cors());

app.get("/version", (req, res) => {
  res.send({
    version: '1.0.0',
  });
  console.log("GET [/version]");
});

app.get("/", (req, res) => {
  res.send({
    ok: true,
  });
  console.log("GET [/]:", req.query);
});

app.get("/webhook", (req, res) => {
  res.send({
    success: true,
  });
  console.log("GET [/webhook]:", req.query);
});

app.post("/webhook", (req, res) => {
  res.send({
    success: true,
  });
  console.log("POST [/webhook]:", req.body);
});

app.listen(port, console.log(`Server is running on port ${port}`));
