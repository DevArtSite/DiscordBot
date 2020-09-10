
const { Message } = require('discord.js')
/**
 * Represents the Discord bot in logged in client’s.
 * @see {@link https://discord.js.org/#/docs/main/stable/class/Message}
 * @extends {Message}
 */
class CommandMessage extends Message {
  constructor (client, data, channel) {
    super(client, data, channel)
    this.execute()
  }

  /**
   * The execution of command if message is it
   * @returns {Promise}
   */
  execute () {
    if (this.author.bot || !this.guild || !this.content.startsWith(this.client.prefix)) return
    const args = this.content.slice(this.client.prefix.length).trim().split(/ +/)
    const cmd = args.shift().toLowerCase()
    const command = this.client.commands.find(command => command.alias.find(str => (str === cmd)))
    if (!command) return
    this.command = command
    this.command.execute(this, args).catch(error => this.client.handleError(error))
    if (this.command.autoDel) this.delete().catch(error => this.client.handleError(error))
    this.client.emit('debug', `[DiscordBot => CommandMessage] ${this.command.name} Executed at ${new Date()}`)

    /**
     * Emitted whenever a command is executed.
     * @event DiscordBot#Command
     * @param {Command} command The guild that has become unavailable
     */
    this.client.emit('command', this, command, args)
  }
}

module.exports = CommandMessage
