require('dotenv').config()
const { DiscordBot, Command } = require('../')
const client = new DiscordBot({
  ggid: '377168761322471425',
  gcid: '747413628101197845',
  dev: 'MNLaugh',
  prefix: '&dev',
  modulesPath: `${__dirname}/modules`
})
const standalone = new Command(client, {
  alias: ['standalone'],
  name: ':blue_circle: Standalone',
  description: [':arrow_right: ``ping`` Test for standalone command!!.'],
  group: 'ping',
  script: async function (message) {
    return message.channel.send('Hey i am a standalone command!!')
  }
})
client.login(process.env.TOKEN || null).then(() => {
  console.log('Bot started token: ', process.env.TOKEN)
  // console.log(Bot)
}).catch(console.error)
// client.on('debug', console.log)
