const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4100;

// LINE SDK
const lineBotSdk = require('@line/bot-sdk')
// create LINE SDK config from env variables
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

// middleware
// lineBotSdk.middleware({
//   channelSecret: config.channelSecret
// });

// create LINE SDK client
const client = new lineBotSdk.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});


app.use(express.json());

// CORS
app.use(cors());

app.get("/version", (req, res) => {
  res.send({
    version: '1.0.0',
  });
  console.log("GET [/version]");
});

app.get("/config", (req, res) => {
  console.log("GET [/config]", config);

  res.send(config);
});

app.get("/", (req, res) => {
  console.log("GET [/]:", req.query);

  res.send({
    ok: true,
  });
});

app.get("/webhook", (req, res) => {
  console.log("GET [/webhook]:", req.query);

  res.send({
    success: true,
  });
});

app.post("/webhook", (req, res) => {
  console.log("POST [/webhook]:", req.body);

  res.send({
    success: true,
  });
});

app.post("/send-message", async (req, res) => {
  console.log("POST [/send-message]:", req.body);
  
  try {
    await client.pushMessage({
      to: req.body.userId,
      messages: [{ type: 'text', text: req.body.text }]
    })
    res.send({
      success: true,
    });
  } catch (error) {
     res.status(400).send(error);
  }
});

app.listen(port, console.log(`Server is running on port ${port}`));
