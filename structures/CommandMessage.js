
const { Message } = require('discord.js')
/**
 * Represents the Message with command properties.
 * @extends {Message}
 */
class CommandMessage extends Message {
  constructor (client, data, channel) {
    super(client, data, channel)

    /**
     * The response of this message
     * @type {CommandMessage}
     */
    this.response = null

    /**
     * The request of this message
     * @type {CommandMessage}
     */
    this.request = null

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
    return (!this.author.bot && this.prefixed() && this.command)
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
   * Get Command message from current message or request message
   * @type {Command}
   */
  get command () {
    const cmd = this.args.shift().toLowerCase()
    const command = this.client.commands.find(command => command.alias.find(str => (str === cmd)))
    return (!command) ? (this.request.command) ? this.request.command : null : command
  }

  /**
   * The execution of command script if this message is command
   * @private
   * @returns {Promise<void>}
   */
  async execute () {
    if (!this.isCommandRequest()) return
    await this.command.execute(this, this.args).catch(error => this.client.handleError(error))
    if (this.command.autodelete) this.delete().catch(error => this.client.handleError(error))
    this.command.messages.set(this.id, this)
    this.client.emit('debug', `[DiscordBot => CommandMessage] ${this.command.name} Executed at ${new Date()}`)

    /**
     * Emitted whenever a command is executed.
     * @event ClientDiscordBot#command
     * @param {CommandMessage} command The guild that has become unavailable
     */
    this.client.emit('command', this)
  }

  /**
   * Replies to the message.
   * Set this response properties with the returned CommandMessage
   * Set request properties to the returned CommandMessage
   * @param {StringResolvable|APIMessage} [content=''] The content for the message
   * @param {MessageOptions|MessageAdditions} [options={}] The options to provide
   * @returns {Promise<CommandMessage|CommandMessage[]>}
   * @example
   * // Reply to a message
   * message.reply('Hey, I\'m a reply!')
   *   .then(() => console.log(`Sent a reply to ${message.author.username}`))
   *   .catch(console.error)
   */
  async reply (content, options) {
    this.response = await super.reply(content, options)
    this.response.request = this
    return this.response
  }
}

module.exports = CommandMessage
