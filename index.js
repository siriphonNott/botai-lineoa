const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4100;

// static
app.use(express.static('public'))

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


app.post("/webhook", (req, res) => {
  console.log("POST [/webhook]:", req.body);

  const event = req.body?.events?.[0];
  console.log('[event.source object]:', JSON.stringify(event?.source));

  if (event?.type === 'message') {
    const message = event.message;
    console.log('[message object]:', JSON.stringify(message));
    
    if (message.type === 'text') {
      // BYE
      if (message.text === 'bye') {
        if (event.source.type === 'room') {
          client.leaveRoom(event.source.roomId);
        } else if (event.source.type === 'group') {
          client.leaveGroup(event.source.groupId);
        } else {
          client.replyMessage({
            replyToken: event.replyToken,
            messages: [{
              type: 'text',
              text: 'I cannot leave a 1-on-1 chat!',
            }]
          });
        }
      } else {
        client.replyMessage({
          replyToken: event.replyToken,
          messages: [{
            type: 'text',
            text: message.text + ' - Reply from BOT AI' ,
          }]
        });
    }
    }
  }

  res.send(req.body.events);
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
    console.log('Error [/send-message]:', error);
    res.status(400).send(error);
  }
});

app.listen(port, console.log(`Server is running on port ${port}`));
