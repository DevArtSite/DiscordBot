module.exports = [{
  alias: ['ping'],
  name: ':blue_circle: Ping',
  description: [
    ':arrow_right: ``ping`` Répond juste Pong!!.'
  ],
  group: 'ping',
  script: async function (message) {
    message.channel.send('Pong!!')
  }
}]
