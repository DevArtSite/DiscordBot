
const { Message } = require('discord.js')
/**
 * Represents the Message with command properties.
 * @see {@link https://discord.js.org/#/docs/main/stable/class/Message}
 * @extends {Message}
 */
class CommandMessage extends Message {
  constructor (client, data, channel) {
    super(client, data, channel)
    this.execute().catch(error => this.client.handleError(error))
  }

  /**
   * Check if message is a Commmand response
   * @type {boolean}
   */
  get isCommandResponse () {
    return (this.author.bot && this.author.id === this.client.user.id)
  }

  /**
   * Check if message is a Commmand request
   * @type {boolean}
   */
  get isCommandRequest () {
    return (this.command)
  }

  /**
   * Check if message content contain client prefix
   * @type {boolean}
   */
  get prefixed () {
    return this.content.startsWith(this.client.prefix)
  }

  /**
   * Get arguments from content message
   * @type {Array}
   */
  get args () {
    return this.content.slice(this.client.prefix.length).trim().split(/ +/)
  }

  /**
   * Get Command from message content
   * @type {Command}
   */
  get command () {
    if (this.author.bot || !this.guild || !this.prefixed()) return
    const cmd = this.args.shift().toLowerCase()
    return this.client.commands.find(command => command.alias.find(str => (str === cmd)))
  }

  /**
   * The execution of command if message is it
   * @private
   * @returns {Promise}
   */
  async execute () {
    if (!this.isCommandRequest()) return
    await this.command.execute(this, this.args).catch(error => this.client.handleError(error))
    if (this.command.autoDel) this.delete().catch(error => this.client.handleError(error))
    this.command.messages.set(this.id, this)
    this.client.emit('debug', `[DiscordBot => CommandMessage] ${this.command.name} Executed at ${new Date()}`)

    /**
     * Emitted whenever a command is executed.
     * @event DiscordBot#Command
     * @param {CommandMessage} command The guild that has become unavailable
     */
    this.client.emit('command', this)
  }
}

module.exports = CommandMessage
