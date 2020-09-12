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
class ClientDiscordBot extends Client {
  /**
   * @param {ClientDiscordBotOptions} options The data of client
   */
  constructor ({ ggid = null, gcid = null, dev = 'Anonymous', prefix = '&', local = 'en', dbname = null, customHelp = { title: null, description: null }, modulesPath = null, useDefaultModule = ['*'] } = {}) {
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
     * @type {string}
     */
    this.dev = dev

    /**
     * The prefix is a character string to recognize a command of a message
     * @type {string}
     */
    this.prefix = prefix

    /**
     * The local is a determining the language to be used by the client
     * @type {string}
     */
    this.local = local

    /**
     * The dbname is a name of mongo database
     * @type {string}
     * @readonly
     */
    this.dbname = dbname

    /**
     * The customHelp is an object containing the title and custom description for the help command
     * @type {HelpEmbedOptions}
     */
    this.customHelp = customHelp

    /**
     * Default module selection enabled
     * @type {string[]|boolean}
     * @readonly
     */
    this.useDefaultModule = useDefaultModule

    /**
     * Commands collection of client
     * @type {Commands}
     * @readonly
     */
    this.commands = new Commands(this)

    /**
     * Modules collection of client
     * @type {Commands}
     * @readonly
     */
    this.modules = new Modules(this, modulesPath)

    /**
     * Mongodb options
     * @type {Object}
     * @private
     * @readonly
     */
    this.dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    /**
     * Mongodb connection
     * @type {MongooseConnection}
     * @private
     * @readonly
     */
    this.db = null
  }

  /**
   * The DiscordBot class
   * @type {DiscordBot}
   * @readonly
   */
  static get DiscordBot () { return ClientDiscordBot }

  /**
   * The Modules class
   * @type {Modules}
   * @private
   * @readonly
   */
  static get Modules () { return Modules }

  /**
   * The Module class
   * @type {Module}
   * @private
   * @readonly
   */
  static get Module () { return Module }

  /**
   * The Commands class
   * @type {Commands}
   * @private
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
   * @see {@link https://discord.js.org/#/docs/main/stable/class/Structures}
   * @readonly
   */
  static get Structures () { return Structures }

  /**
   * The Snowflake class
   * @type {SnowflakeUtil}
   * @see {@link https://discord.js.org/#/docs/main/stable/class/SnowflakeUtil}
   * @readonly
   */
  static get Snowflake () { return Snowflake }

  /**
   * The MessageEmbed class
   * @param {EmbedData} [data={}] Whether to skip the cache check and request the API
   * @returns {MessageEmbed}
   * @example
   * client.MessageEmbed({ title: 'My cool title', description: 'My awsome description' })
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

  /**
   * The MessageEmbed class
   * @private
   * @returns {MongooseConnection}
   */
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

  /**
   * Handle error, emit
   * @param {Error} [error] Error
   */
  handleError (error) {
    if (!this.emit) throw error

    /**
     * Emitted for general errors information.
     * @event ClientDiscordBot#error
     * @param {Error} error The error
     */
    return this.emit('error', error)
  }
}

module.exports = ClientDiscordBot

/**
 * DiscordBot Options.
 * @typedef {Object} ClientDiscordBotOptions
 * @property {Snowflake} [ggid] Id of the developer’s guild
 * @property {Snowflake} [gcid] Id of the developer’s channel on developer’s guild
 * @property {string} [dev] Name of the main developer
 * @property {string} [prefix] Character string to recognize a command of a message
 * @property {string} [dbname] Name of mongo database
 * @property {Array|boolean} [useDefaultModule] Default module selection enabled
 */

/**
 * HelpEmbedOptions Options.
 * @typedef {Object} HelpEmbedOptions
 * @property {string} [title] Title embed of command
 * @property {string} [description] Description embed of Help command
 */

/**
 * Data MessageEmbed.
 * @typedef {Object} EmbedData
 * @property {string} [title] The title of embed
 * @property {string} [description] The description of embed
 * @property {ColorResolvable} [color=RANDOM] The color of the embed
 * @property {string} [url=client.user.displayAvatarURL()] The URL of the thumbnail
 * @property {Date|number} [timestamp=Date.now()] The timestamp or date
 * @property {EmbedDataFooter} [footer] The footer of this embed
 */

/**
 * Data MessageEmbed Footer.
 * @typedef {Object} EmbedDataFooter
 * @property {string} [text] text The text of the footer
 * @property {string} [iconUrl] The icon URL of the footer
 */

/**
 * The Structures class
 * @see {@link https://discord.js.org/#/docs/main/stable/class/Structures}
 * @typedef {Object} Structures
 */

/**
 * Can be a number, hex string, an RGB array like:
 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable}
 * @typedef {string|number|number[]} ColorResolvable
 */

/**
 * A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z
 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/Snowflake}
 * @typedef {string} Snowflake
 */

/**
 * Mongodb connection
 * @see {@link https://mongoosejs.com/docs/api/connection.html#connection_Connection}
 * @typedef {Object} MongooseConnection
 */

/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has an ID, for significantly improved performance and ease-of-use.
 * @see {@link https://discord.js.org/#/docs/collection/master/class/Collection}
 * @typedef {Class} Collection
 */
