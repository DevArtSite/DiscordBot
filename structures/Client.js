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
   * @param {Object} DiscordBotOptions The data of client
   */
  constructor ({ ggid = null, gcid = null, dev = 'Anonymous', prefix = '&', dbname = null, customHelp = { title: null, description: null }, modulesPath = null, useDefaultModule = ['*'] } = {}) {
    super()
    /**
     * The ggid (global guild id) is the id of the developer’s guild
     * @type {Snowflake}
     * @see {@link https://discord.js.org/#/docs/main/stable/class/SnowflakeUtil}
     * @readonly
     */
    this.ggid = ggid

    /**
     * The gcid (global channel id) is the id of the developer’s channel on developer’s guild
     * @type {Snowflake}
     * @see {@link https://discord.js.org/#/docs/main/stable/class/SnowflakeUtil}
     * @readonly
     */
    this.gcid = gcid

    /**
     * The dev is the name of the main developer
     * @type {string}
     * @readonly
     */
    this.dev = dev

    /**
     * The prefix is a character string to recognize a command of a message
     * @type {string}
     * @readonly
     */
    this.prefix = prefix

    /**
     * The dbname is a name of mongo database
     * @type {string}
     * @readonly
     */
    this.dbname = dbname

    /**
     * The customHelp is an object containing the title and custom description for the help command
     * @type {HelpEmbedOptions}
     * @readonly
     */
    this.customHelp = customHelp

    /**
     * Default module selection enabled
     * @type {string[]|boolean}
     * @readonly
     */
    this.useDefaultModule = useDefaultModule

    this.commands = new Commands(this)
    this.modules = new Modules(this, modulesPath)

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
   * @see {@link https://discord.js.org/#/docs/main/stable/class/Structures}
   * @readonly
   */
  static get Structures () { return Structures }

  /**
   * The Snowflake class
   * @type {Snowflake}
   * @see {@link https://discord.js.org/#/docs/main/stable/class/SnowflakeUtil}
   * @readonly
   */
  static get Snowflake () { return Snowflake }

  /**
   * The MessageEmbed class
   * @param {EmbedData} [data] Whether to skip the cache check and request the API
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

  /**
   * The MessageEmbed class
   * @see {@link https://mongoosejs.com/docs/api/connection.html#connection_Connection}
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
   * Handle error
   * @private
   */
  handleError (error) {
    if (!this.emit) throw error
    return this.emit('error', error)
  }
}

module.exports = DiscordBot

/**
 * DiscordBot Options.
 * @see {@link https://discord.js.org/#/docs/main/stable/class/SnowflakeUtil}
 * @typedef {Object} DiscordBotOptions
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
 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable}
 * @typedef {Object} EmbedData
 * @property {string} [title] The title of embed
 * @property {string} [description] The description of embed
 * @property {ColorResolvable} [color=RANDOM] The color of the embed
 * @property {string} [url=client.user.displayAvatarURL()] The URL of the thumbnail
 * @property {Date|number} [timestamp=Date.now()] The timestamp or date
 * @property {DataMessageFooter} [footer] The footer of this embed
 */

/**
 * Can be a number, hex string, an RGB array like:
 * ```js
 * [255, 0, 255] // purple
 * ```
 * or one of the following strings:
 * - `DEFAULT`
 * - `WHITE`
 * - `AQUA`
 * - `GREEN`
 * - `BLUE`
 * - `YELLOW`
 * - `PURPLE`
 * - `LUMINOUS_VIVID_PINK`
 * - `GOLD`
 * - `ORANGE`
 * - `RED`
 * - `GREY`
 * - `DARKER_GREY`
 * - `NAVY`
 * - `DARK_AQUA`
 * - `DARK_GREEN`
 * - `DARK_BLUE`
 * - `DARK_PURPLE`
 * - `DARK_VIVID_PINK`
 * - `DARK_GOLD`
 * - `DARK_ORANGE`
 * - `DARK_RED`
 * - `DARK_GREY`
 * - `LIGHT_GREY`
 * - `DARK_NAVY`
 * - `BLURPLE`
 * - `GREYPLE`
 * - `DARK_BUT_NOT_BLACK`
 * - `NOT_QUITE_BLACK`
 * - `RANDOM`
 * @typedef {string|number|number[]} ColorResolvable
 */

/**
 * Data MessageEmbed Footer.
 * @typedef {Object} EmbedDataFooter
 * @property {string} [text] text The text of the footer
 * @property {string} [iconUrl] The icon URL of the footer
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
