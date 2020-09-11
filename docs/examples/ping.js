const { DiscordBot, Command } = require('@devartsite/discordbot')

const client = new DiscordBot({
  ggid: 'my guild id',
  gcid: 'my channel id',
  dev: 'my name',
  prefix: '&prefix'
})

const myCommand = new Command(client, {
  alias: ['ping'],
  name: ':blue_circle: Ping',
  description: [
    ':arrow_right: ``ping`` Respond Pong!!.'
  ],
  group: 'ping',
  script: async function (message) {
    message.channel.send('Pong!!')
  }
})

client.login('my token').then(() => {
  console.log('Bot started and ready')
}).catch(console.error)
