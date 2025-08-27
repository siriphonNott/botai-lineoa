import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 4100

// Import Mock Data
import { channels } from './mock/db.js'
import { messageTypes } from './mock/messageTypes.js'

// static
app.use(express.static('public'))

// LINE SDK
import { messagingApi } from '@line/bot-sdk'
const { MessagingApiClient } = messagingApi

// create LINE SDK config from env variables
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
}

// middleware
// lineBotSdk.middleware({
//   channelSecret: config.channelSecret,
// })

// create LINE SDK client
const createClientInstance = (channelAccessToken) => {
  return new MessagingApiClient({
    channelAccessToken,
  })
}

app.use(express.json())

// CORS
app.use(cors())

app.get('/', (req, res) => {
  console.log('GET [/]:', req.query)

  res.send({
    ok: true,
  })
})

app.get('/version', (req, res) => {
  res.send({
    version: '1.0.0',
  })
  console.log('GET [/version]')
})

app.get('/config', (req, res) => {
  console.log('GET [/config]', config)

  res.send(config)
})

app.post('/:uid/webhook', async (req, res) => {
  console.log('POST [/webhook]:', req.body)

  const channel = channels.find((v) => v.uid === req.params.uid)

  // Check channel
  if (!channel) return res.status(404).send({ errMsg: 'Channel not found' })

  const client = createClientInstance(channel.channelAccessToken)

  try {
    const event = req.body.events[0] // join, leave, message
    // Have Event
    if (event) {
      console.log('[event.source object]:', JSON.stringify(event.source))

      if (event?.type === 'message') {
        const message = event.message
        console.log('[message object]:', JSON.stringify(message))

        if (message.type === 'text') {
          // BYE
          if (message.text.toLocaleLowerCase() === 'bye') {
            if (event.source.type === 'room') {
              await client.leaveRoom(event.source.roomId)
            } else if (event.source.type === 'group') {
              await client.leaveGroup(event.source.groupId)
            } else {
              client.replyMessage({
                replyToken: event.replyToken,
                messages: [
                  {
                    type: 'text',
                    text: 'I cannot leave a 1-on-1 chat!',
                  },
                ],
              })
            }
          } else if (
            ['hi', 'hello', 'สวัสดี', 'ดี'].some((v) => v === message.text.toLocaleLowerCase())
          ) {
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: messageTypes.greeting(message.text),
            })
          } else if (['โปรเด็ด', 'โปรวันนี้'].some((v) => v === message.text.toLocaleLowerCase())) {
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: messageTypes.promotionDetail(),
            })
          } else if (['promo', 'promotion', 'โปร', 'โปรโมชั่น'].some((v) => v === message.text.toLocaleLowerCase())) {
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: messageTypes.promotions(),
            })
          } else if (message.text.includes('สมัคร')) {
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: messageTypes.regsiter(),
            })
          } else {
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: messageTypes.reply(message.text),
            })
          }
        }
      }
    } else {
      // Verify webhook
      return res.send(req.body.events)
    }
  } catch (error) {
    console.log('Error [webhook]:', error)
  }

  res.send({
    success: true,
  })
})

app.post('/send-message', async (req, res) => {
  console.log('POST [/send-message]:', req.body)

  try {
    await client.pushMessage({
      to: req.body.userId,
      messages: [{ type: 'text', text: req.body.text }],
    })
    res.send({
      success: true,
    })
  } catch (error) {
    console.log('Error [/send-message]:', error)
    res.status(400).send(error)
  }
})

app.listen(port, console.log(`Server is running on port ${port}`))
