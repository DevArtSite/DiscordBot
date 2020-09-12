module.exports = [{
  alias: ['ping'],
  name: ':blue_circle: Ping',
  description: [
    ':arrow_right: ``ping`` Just Pong!!'
  ],
  group: 'ping',
  script: async function (message) {
    message.reply('Pong!!')
  }
}]
