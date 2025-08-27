export const messageTypes = {
  reply: (text) => [
    {
      type: 'text',
      text: text + ' - Reply from BOT AI',
    },
  ],
  greeting: (text) => [
    {
      type: 'text',
      text: text + ' - Reply from BOT AI',
    },
    {
      type: 'sticker',
      packageId: '11537',
      stickerId: ['52002734', '52002738', '52002736'][Math.floor(Math.random() * 3)],
    },
  ],
  regsiter: () => [
    {
      type: 'image',
      originalContentUrl: 'https://online.anyflip.com/tdqbv/mnns/files/mobile/1.jpg',
      previewImageUrl: 'https://online.anyflip.com/tdqbv/mnns/files/mobile/1.jpg',
    },
  ],
  promotions: () => [
    {
      type: 'flex',
      altText: 'Image Gallery',
      contents: {
        type: 'carousel',
        contents: [
          {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://www.mangozero.com/wp-content/uploads/2017/12/review-true-money-wallet-for-purchase-featured-1-1-1080x630.jpg',
              size: 'full',
              aspectRatio: '20:13',
              aspectMode: 'cover',
            },
          },
          {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://knowledgedreamblog.wordpress.com/wp-content/uploads/2017/11/re-key-1.png',
              size: 'full',
              aspectRatio: '20:13',
              aspectMode: 'cover',
            },
          },
           {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://static.thairath.co.th/media/dFQROr7oWzulq5Fa4VROiPC3vv2yBZsmtP6ZemxDKIq8LTrxnqA0wGj4a83TaEYV7XP.jpg',
              size: 'full',
              aspectRatio: '20:13',
              aspectMode: 'cover',
            },
          },
        ],
      },
    },
  ],
}
