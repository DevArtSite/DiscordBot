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
  description: [
    ':arrow_right: ``ping`` Make a simple embeded test!!'
  ],
  group: 'ping',
  script: async function (message) {
    const embed = this.client.MessageEmbed({ title: 'My cool title', description: 'My awsome description' })
    embed.addField('field name', 'field value')
    message.replyEmbed(embed)
      .then((replymessage) => {
        console.log(`Sent a reply embed to ${message.author.username}`)
        console.log(replymessage)
      })
      .catch(console.error)
  }
}]
