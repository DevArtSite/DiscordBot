const { Client, MessageEmbed, Structures, Snowflake } = require('discord.js')
const mongoose = require('mongoose')
const Module = require('./structures/Module')
const Modules = require('./structures/Modules')
const Command = require('./structures/Command')
const Commands = require('./structures/Commands')
require('./structures/extends')
/**
 * Represents the Discord bot in logged in client’s.
 * @extends {Client}
 */
module.exports = class DiscordBot extends Client {
  constructor ({ ggid = null, gcid = null, dev = 'Anonymous', prefix = '&', dbname = null, customHelp = { title: null, description: null }, modulesPath = null, useDefaultModule = ['*'] } = {}) {
    super()
    /**
     * The ggid (global guild id) is the id of the developer’s guild
     * @name ggid
     * @type {Snowflake}
     * @readonly
     */
    this.gid = ggid

    /**
     * The gcid (global channel id) is the id of the developer’s channel on developer’s guild
     * @name gcid
     * @type {Snowflake}
     * @readonly
     */
    this.cid = gcid

    /**
     * The dev is the name of the main developer
     * @name dev
     * @type {String}
     * @readonly
     */
    this.dev = dev

    /**
     * The prefix is a character string to recognize a command of a message
     * @name prefix
     * @type {String}
     * @readonly
     */
    this.prefix = prefix

    /**
     * The dbname is a name of mongo database
     * @name dbname
     * @type {String}
     * @readonly
     */
    this.dbname = dbname

    /**
     * The customHelp is an object containing the title and custom description for the help command
     * @name customHelp
     * @type {Object}
     * @readonly
     */
    this.customHelp = customHelp

    /**
     * The commands is an Commands instance of client
     * @name commands
     * @type {Commands}
     * @readonly
     */
    this.commands = new Commands(this)

    /**
     * The modules is an Modules instance of client
     * @name modules
     * @type {Modules}
     * @readonly
     */
    this.modules = new Modules(this, modulesPath)

    /**
     * Default module selection enabled
     * @name useDefaultModule
     * @type {Array}
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
   * @type {Function}
   * @readonly
   */
  static get DiscordBot () { return DiscordBot }

  /**
   * The Modules class
   * @type {Function}
   * @readonly
   */
  static get Modules () { return Modules }

  /**
   * The Module class
   * @type {Object}
   * @readonly
   */
  static get Module () { return Module }

  /**
   * The Commands class
   * @type {Object}
   * @readonly
   */
  static get Commands () { return Commands }

  /**
   * The Command class
   * @type {Object}
   * @readonly
   */
  static get Command () { return Command }
  get Command () { return Command }

  /**
   * The Structures class
   * @type {Object}
   * @readonly
   */
  static get Structures () { return Structures }

  /**
   * The Snowflake class
   * @type {Object}
   * @readonly
   */
  static get Snowflake () { return Snowflake }

  /**
   * Data MessageEmbed.
   * @typedef {Object}
   * @property {String} [title] The title of embed
   * @property {String} [description] The description of embed
   * @property {ColorResolvable} [color=RANDOM] The color of the embed
   * @property {string} [url=client.user.displayAvatarURL()] The URL of the thumbnail
   * @property {Date|number} [timestamp=Date.now()] The timestamp or date
   * @property {Object} [footer] The footer of this embed
   */

  /**
   * Data MessageEmbed Footer.
   * @typedef {Object}
   * @property {String} [text] text The text of the footer
   * @property {String} [iconUrl] The icon URL of the footer
   */

  /**
   * The MessageEmbed class
   * @name MessageEmbed
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

  async login (token) {
    await this.connect().catch(error => this.handleError(error))
    await this.modules.init()
    await this.modules.start()
    return super.login(token)
  }

  addEvent (eventFunctions) {
    if (typeof eventFunctions !== 'object' && typeof eventFunctions.length !== 'undefined') throw new Error('eventFunctions must be an Array')
    const events = Object.keys(eventFunctions)
    events.forEach(eventName => {
      if (typeof eventFunctions[eventName] === 'function') return this.on(eventName, eventFunctions[eventName])
      else if (typeof eventFunctions[eventName] === 'object' && eventFunctions[eventName].length && eventFunctions[eventName].length > 0) eventFunctions[eventName].forEach(eventFunction => this.on(eventName, eventFunction))
      else throw new Error('eventFunction must be an Function or Array containing Function')
    })
  }

  handleError (error) {
    if (!this.emit) throw error
    return this.emit('error', error)
  }
}
