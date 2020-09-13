module.exports = [{
  alias: ['test'],
  name: ':blue_circle: Test',
  description: [
    ':arrow_right: ``ping`` Make a simple test!!'
  ],
  group: 'ping',
  script: async function (message) {
    message.channel.send('Pong!!')
  }
}, {
  alias: ['testEmbed'],
  name: ':blue_circle: Test embed',
  description: [':arrow_right: ``ping`` Make a simple embeded test!!'],
  group: 'ping',
  script: async function (message) {
    const embed = this.client.MessageEmbed({ title: 'My cool title', description: 'My awsome description' })
    embed.addField('field name', 'field value')
    message.replyEmbed(embed)
      .then(() => console.log(`Sent a reply embed to ${message.author.username}`))
      .catch(console.error)
  }
}, {
  alias: ['testnotdeleted'],
  name: ':blue_circle: Test request nodeleted',
  description: [':arrow_right: ``ping`` Make a simple test with no delete request command!!'],
  group: 'ping',
  script: async message => message.reply('If all goes well the request for this command has not been deleted'),
  autodelete: false
}]
