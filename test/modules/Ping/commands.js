module.exports = [{
  alias: ['ping'],
  name: ':blue_circle: Ping',
  description: [':arrow_right: ``ping`` Just Pong!!'],
  group: 'ping',
  script: async (message) => message.reply('Pong!!')
}]
