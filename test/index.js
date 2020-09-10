require('dotenv').config()
const DiscordBot = require('../')
const Bot = new DiscordBot({
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
Bot.login(process.env.TOKEN || null).then(() => {
  console.log('Bot started token: ', process.env.TOKEN)
  // console.log(Bot)
}).catch(console.error)
Bot.on('debug', console.log)
