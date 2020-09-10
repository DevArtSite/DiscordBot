require('dotenv').config()
const DiscordBot = require('../')
const client = new DiscordBot({
  ggid: '377168761322471425',
  gcid: '747413628101197845',
  dev: 'MNLaugh',
  prefix: '&dev',
  dbname: null,
  customHelp: {
    title: null,
    description: null
  },
  modulesPath: `${__dirname}/modules` // ,
  // useDefaultModule: ['*']
})
client.login(process.env.TOKEN || null).then(() => {
  console.log('Bot started token: ', process.env.TOKEN)
  // console.log(Bot)
}).catch(console.error)
client.on('debug', console.log)
