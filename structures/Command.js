const { Snowflake } = require('discord.js')
module.exports = class Command {
  constructor (module, { alias = [], name = '', description = '', group = null, script = () => null, autoDel = true }) {
    /**
     * The instance of DicordBot client
     * @name client
     * @type {DicordBot}
     * @readonly
     */
    this.client = module.client

    /**
     * The instance of Module
     * @name module
     * @type {Module}
     * @readonly
     */
    this.module = module

    /**
     * The alias array
     * @name alias
     * @type {Array}
     * @readonly
     */
    this.alias = alias

    /**
     * The name of command
     * @name name
     * @type {String}
     * @readonly
     */
    this.name = name

    /**
     * The description of command
     * @name description
     * @type {String}
     * @readonly
     */
    this.description = description

    /**
     * The group name of command
     * @name group
     * @type {String}
     * @readonly
     */
    this.group = group

    /**
     * The script function of command
     * @name script
     * @type {Function}
     * @readonly
     */
    this.script = script

    /**
     * The status of this command
     * @name delete
     * @type {Boolean}
     * @readonly
     */
    this.delete = autoDel

    /**
     * The id of this command
     * @name id
     * @type {Snowflake}
     * @readonly
     */
    this.id = Snowflake.generate()

    this.push()
    this.client.emit('debug', `[DiscordBot => Command] ${this.name} Create`)
  }

  /**
   * Execute script command
   * @name execute
   * @param {CommandMessage} [message] Instance of CommandMessage
   * @param {Array} [args] Arguments
   */
  async execute (message, args) {
    return await this.script(message, args).catch(error => this.client.handleError(error))
  }

  /**
   * Push this command to client & module commands collection
   * @name push
   */
  push () {
    ['client', 'module'].forEach(collection => this[collection].commands.set(this.id, this))
  }
}
