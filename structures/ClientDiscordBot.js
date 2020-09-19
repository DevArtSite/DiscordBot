const { Client, MessageEmbed, ClientUser } = require('discord.js')
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
  constructor ({ ggid = null, gcid = null, dev = 'Anonymous', prefix = '&', local = 'en', dbname = null, customHelp = { title: null, description: null, contentlimited: null, emojis: { title: ':regional_indicator_h: ', alias: ':regional_indicator_a: ' } }, modulesPath = null, useDefaultModule = ['*'] } = {}) {
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
    if (!this.customHelp.emojis) this.customHelp.emojis = { title: ':regional_indicator_h: ', alias: ':regional_indicator_a: ' }

    /**
     * Default module selection enabled when client login
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
     * @type {Modules}
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

  get Module () { return Module }
  get Commands () { return Commands }
  get Command () { return Command }

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
      thumbnail: `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`,
      timestamp: new Date(),
      footer: {
        text: `${this.user.tag} | ${this.dev}`,
        iconUrl: `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`
      }
    }, data)
    const embed = new MessageEmbed(data)
    embed.setThumbnail(data.thumbnail)
    embed.setFooter(data.footer.text, data.footer.iconUrl)
    return embed
  }

  /**
   * The mongoDb connection function
   * @private
   * @returns {MongooseConnection}
   */
  async connect () {
    if (!this.dbname) return
    const mongodb = await mongoose.connect(`mongodb://localhost:27017/${this.dbname}`, this.dbOptions)
      .catch(error => { throw error })
    this.db = mongodb.connection
    if (this.db.readyState !== 1) await new Promise(resolve => this.db.on('open', () => resolve(true)))
    this.emit('debug', '[DiscordBot] Mongodb connected')
    return this.db
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   * @param {string} [token] Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login('my token');
   */
  async login (token) {
    await this.connect()
      .catch(error => { throw error })
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
 * @property {HelpEmbedOptions} [customHelp] Custom data for help embed
 */

/**
 * HelpEmbedOptions Options.
 * @typedef {Object} HelpEmbedOptions
 * @property {TitleHelpFunction} [title] Title embed of command
 * @property {DescriptionHelpFunction} [description] Description embed of Help command
 * @property {ContentHelpLimited} [contentlimited] Content description if the real description of command
 * @property {EmojisHelp} [emojis]
 */

/**
 * TitleHelpFunction function.
 * @typedef {Function} TitleHelpFunction
 * @param {string} [tag=ClientDiscordBot.user.tag] Client user tag
 * @param {string} [group=Command.group|undefined] Command group name
 */

/**
 * DescriptionHelpFunction function.
 * @typedef {Function} DescriptionHelpFunction
 * @param {string} [prefix=ClientDiscordBot.prefix] Client prefix
 */

/**
 * ContentLimited is content description if the real description of command is too long to be displayed.
 * @typedef {string} ContentHelpLimited
 */

/**
 * EmojisHelp function.
 * @typedef {Object} EmojisHelp
 * @param {string} [title=':regional_indicator_h: ']
 * @param {string} [alias=':regional_indicator_a: ']
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
 * @typedef {Object} Collection
 */

/**
 * Represents a message on Discord.
 * @see {@link https://discord.js.org/#/docs/main/stable/class/Message}
 * @typedef {Object} Message
 */
