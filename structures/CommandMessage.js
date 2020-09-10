
const { Message } = require('discord.js')
module.exports = class CommandMessage extends Message {
  constructor (client, data, channel) {
    super(client, data, channel)
    this.execute()
  }

  execute () {
    if (this.author.bot || !this.guild || !this.content.startsWith(this.client.prefix)) return
    const args = this.content.slice(this.client.prefix.length).trim().split(/ +/)
    const cmd = args.shift().toLowerCase()
    const command = this.client.commands.find(command => command.alias.find(str => (str === cmd)))
    if (!command) return
    this.command = command
    this.command.execute(this, args).catch(error => this.client.handleError(error))
    if (this.command.delete) this.delete().catch(error => this.client.handleError(error))
    this.client.emit('debug', `[DiscordBot => CommandMessage] ${this.command.name} Executed at ${new Date()}`)
  }
}
