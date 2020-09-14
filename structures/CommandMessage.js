
const { Message, Collection, MessageEmbed } = require('discord.js')
/**
 * Represents the Message with command properties.
 * @extends {Message}
 */
class CommandMessage extends Message {
  constructor (client, data, channel) {
    super(client, data, channel)

    /**
     * The responses Collection of this message if this message is a command request
     * @type {Collection<CommandMessage>}
     */
    this.responses = new Collection()

    /**
     * The request of this message if this message is a command response
     * @type {CommandMessage}
     */
    this.request = null

    this.execute().catch(error => this.client.handleError(error))
  }

  /**
   * Check if message is a commmand response
   * @type {boolean}
   */
  get isCommandResponse () {
    return (this.author.bot && this.author.id === this.client.user.id)
  }

  /**
   * Check if message is a commmand request
   * @type {boolean}
   */
  get isCommandRequest () {
    return (!this.author.bot && this.prefixed && this.command)
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
   * @type {Array<string>}
   */
  get args () {
    return this.content.slice(this.client.prefix.length).trim().split(/ +/)
  }

  /**
   * Get Command message from current message or request message
   * @type {Command}
   */
  get command () {
    const cmd = this.args.shift()
    const command = this.client.commands.find(command => {
      return command.alias.find(str => {
        return (str === cmd)
      })
    })
    return (!command) ? (this.request.command) ? this.request.command : null : command
  }

  /**
   * The execution of command script if this message is command
   * @private
   * @returns {Promise<void>}
   */
  async execute () {
    if (!this.isCommandRequest) return
    console.log(this.args.slice(1))
    await this.command.execute(this, this.args.slice(1)).catch(error => this.client.handleError(error))
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
   * Set request properties to the returned CommandMessage
   * Set this response properties with the returned CommandMessage
   * @param {StringResolvable|APIMessage} [content=''] The content for the message
   * @param {MessageOptions|MessageAdditions} [options={}] The options to provide
   * @returns {Promise<CommandMessage|CommandMessage[]>}
   * @example
   * // Reply to a message
   * message.reply('Hey, I\'m a reply!')
   *   .then(() => console.log(`Sent a reply to ${message.author.username}`))
   *   .catch(console.error)
   */
  async reply (content = '', options = {}) {
    const response = await super.reply(content, options).catch(error => this.client.handleError(error))
    response.request = this
    this.responses.set(response.id, response)
    return response
  }

  /**
   * Replies embed to the message.
   * Set request properties to the returned CommandMessage
   * Set this response properties with the returned CommandMessage
   * @param {MessageEmbed} [embed] The embed for the message
   * @param {MessageOptions|MessageAdditions} [options={}] The options to provide
   * @returns {Promise<CommandMessage|CommandMessage[]>}
   * @example
   * // Reply embed to a message
   * const embed = client.MessageEmbed({ title: 'My cool title', description: 'My awsome description' })
   *   .addField('field name', 'field value')
   * message.reply(embed)
   *   .then(() => console.log(`Sent a reply embed to ${message.author.username}`))
   *   .catch(console.error)
   */
  async replyEmbed (embed, options) {
    if (!(embed instanceof MessageEmbed)) throw new Error('embed must be an instance of MessageEmbed')
    const response = await this.channel.send(`${this.member}`, embed, options).catch(error => this.client.handleError(error))
    response.request = this
    this.responses.set(response.id, response)
    return response
  }
}

module.exports = CommandMessage

/**
 * Data that can be resolved to give a string. This can be:
 * * A string
 * * An array (joined with a new line delimiter to give a string)
 * * Any value
 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/StringResolvable}
 * @typedef {string|Array|*} StringResolvable
 */

/**
 * Represents a message to be sent to the API.
 * @see {@link https://discord.js.org/#/docs/main/stable/class/APIMessage}
 * @typedef {Object} APIMessage
 */

/**
 * Options provided when sending or editing a message.
 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/MessageOptions}
 * @typedef {Object} MessageOptions
 */

/**
 * Additional items that can be sent with a message.
 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/MessageAdditions}
 * @typedef {MessageEmbed|MessageAttachment|Array<MessageEmbed|MessageAttachment>} MessageAdditions
 */

/**
 * Represents an embed in a message (image/video preview, rich embed, etc.)
 * @see {@link https://discord.js.org/#/docs/main/stable/class/MessageEmbed}
 * @typedef {Object} MessageEmbed
 */
