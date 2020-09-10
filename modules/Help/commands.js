module.exports = [{
  alias: ['h', 'help'],
  name: ':blue_circle: Help',
  description: [
    ':arrow_right: ``h`` ou ``help`` Vous fournis la liste complète des commandes.',
    ':arrow_right: ``h "command"`` ou ``help "command"`` Pour voir l\'aide pour une commande spécifique.'
  ],
  group: 'help',
  script: async function (message, args) {
    const embeds = await this.module.methods.help(args).catch(error => this.client.handleError(error))
    if (!embeds) return
    return await Promise.all(embeds.map(embed => message.channel.send(`${message.member}`, embed).catch(error => this.client.handleError(error)))).catch(error => this.client.handleError(error))
  }
}]
