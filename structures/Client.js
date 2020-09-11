const { Client, MessageEmbed, Structures, Snowflake } = require('discord.js')
const mongoose = require('mongoose')
const Module = require('./Module')
const Modules = require('./Modules')
const Command = require('./Command')
const Commands = require('./Commands')
require('./extends')
/**
 * Represents the Discord bot in logged in client’s.
 * @extends {Client}
 */
class DiscordBot extends Client {
  /**
   * @param {Object} DiscordBotClientData The data of client
   */
  constructor ({ ggid = null, gcid = null, dev = 'Anonymous', prefix = '&', dbname = null, customHelp = { title: null, description: null }, modulesPath = null, useDefaultModule = ['*'] } = {}) {
    super()
    /**
     * The ggid (global guild id) is the id of the developer’s guild
     * @type {Snowflake}
     * @readonly
     */
    this.ggid = ggid

    /**
     * The gcid (global channel id) is the id of the developer’s channel on developer’s guild
     * @type {Snowflake}
     * @readonly
     */
    this.gcid = gcid

    /**
     * The dev is the name of the main developer
     * @type {String}
     * @readonly
     */
    this.dev = dev

    /**
     * The prefix is a character string to recognize a command of a message
     * @type {String}
     * @readonly
     */
    this.prefix = prefix

    /**
     * The dbname is a name of mongo database
     * @type {String}
     * @readonly
     */
    this.dbname = dbname

    /**
     * The customHelp is an object containing the title and custom description for the help command
     * @type {Object}
     * @readonly
     */
    this.customHelp = customHelp

    /**
     * The commands is an Commands instance of client
     * @type {Commands}
     * @readonly
     */
    this.commands = new Commands(this)

    /**
     * The modules is an Modules instance of client
     * @type {Modules}
     * @readonly
     */
    this.modules = new Modules(this, modulesPath)

    /**
     * Default module selection enabled
     * @type {Array|Boolean}
     * @readonly
     */
    this.useDefaultModule = useDefaultModule

    this.dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    this.db = null
  }

  /**
   * The DiscordBot class
   * @type {DiscordBot}
   * @readonly
   */
  static get DiscordBot () { return DiscordBot }

  /**
   * The Modules class
   * @type {Modules}
   * @readonly
   */
  static get Modules () { return Modules }

  /**
   * The Module class
   * @type {Module}
   * @readonly
   */
  static get Module () { return Module }

  /**
   * The Commands class
   * @type {Commands}
   * @readonly
   */
  static get Commands () { return Commands }

  /**
   * The Command class
   * @type {Command}
   * @readonly
   */
  static get Command () { return Command }
  get Command () { return Command }

  /**
   * The Structures class
   * @type {Structures}
   * @see Structures {@link https://discord.js.org/#/docs/main/stable/class/Structures}
   * @readonly
   */
  static get Structures () { return Structures }

  /**
   * The Snowflake class
   * @type {Snowflake}
   * @see{@link https://discord.js.org/#/docs/main/stable/class/SnowflakeUtil}
   * @readonly
   */
  static get Snowflake () { return Snowflake }

  /**
   * The MessageEmbed class
   * @param {Object} [data] Whether to skip the cache check and request the API
   * @returns {MessageEmbed}
   */
  MessageEmbed (data = {}) {
    data = Object.assign({
      title: null,
      description: null,
      color: 'RANDOM',
      thumbnail: this.user.displayAvatarURL(),
      timestamp: new Date(),
      footer: {
        text: `${this.user.tag} | ${this.dev}`,
        iconUrl: this.user.displayAvatarURL()
      }
    }, data)
    return new MessageEmbed(data)
  }

  async connect () {
    if (!this.dbname) return
    const mongodb = await mongoose.connect(`mongodb://localhost:27017/${this.dbname}`, this.dbOptions).catch(error => this.handleError(error))
    this.db = mongodb.connection
    if (this.db.readyState !== 1) await new Promise(resolve => this.db.on('open', () => resolve(true)))
    this.emit('debug', '[DiscordBot] Mongodb connected')
    return this.db
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   * @param {string} [token=this.token] Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login('my token');
   */
  async login (token) {
    await this.connect().catch(error => this.handleError(error))
    await this.modules.init()
    await this.modules.start()
    return super.login(token)
  }

  handleError (error) {
    if (!this.emit) throw error
    return this.emit('error', error)
  }
}

module.exports = DiscordBot

/**
 * Data MessageEmbed.
 * @typedef {Object} DataMessage
 * @property {String} [title] The title of embed
 * @property {String} [description] The description of embed
 * @property {ColorResolvable} [color=RANDOM] The color of the embed
 * @property {string} [url=client.user.displayAvatarURL()] The URL of the thumbnail
 * @property {Date|number} [timestamp=Date.now()] The timestamp or date
 * @property {Object} [footer] The footer of this embed
 */

/**
 * Data MessageEmbed Footer.
 * @typedef {Object} DataMessageFooter
 * @property {String} [text] text The text of the footer
 * @property {String} [iconUrl] The icon URL of the footer
 */

/**
 * Emitted for general warnings.
 * @event DiscordBot#warn
 * @param {string} info The warning
 */

/**
 * Emitted for general debugging information.
 * @event DiscordBot#debug
 * @param {string} info The debug information
 */

/**
 * Emitted for general errors information.
 * @event DiscordBot#error
 * @param {Error} error The error
 */
