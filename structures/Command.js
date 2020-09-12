const { Snowflake, Collection } = require('discord.js')
/**
 * Represents the command.
 * @param {DiscordBot|Module} [module] Should be Module if is command from module or Client if is a command out of module context
 * @param {CommandOptions} [data] Data for command
 */
class Command {
  constructor (module, { alias, name, description, group = null, script, autoDel = true }) {
    /**
     * The instance of DicordBot client
     * @type {DicordBot}
     * @readonly
     */
    this.client = (!module.client) ? module : module.client

    /**
     * The instance of Module
     * @type {Module}
     * @readonly
     */
    this.module = (!module.client) ? null : module

    /**
     * The id of this command
     * @type {Snowflake}
     * @readonly
     */
    this.id = Snowflake.generate()

    /**
     * The name of command
     * @type {String}
     * @readonly
     */
    this.name = name

    /**
     * The description of command
     * @type {String}
     * @readonly
     */
    this.description = description

    /**
     * The alias array
     * @type {Array}
     * @readonly
     */
    this.alias = alias

    /**
     * The group name of command
     * @type {String}
     * @readonly
     */
    this.group = group

    /**
     * The script function of command
     * @type {Function}
     * @readonly
     */
    this.script = script

    /**
     * The status of this command
     * @type {Boolean}
     * @readonly
     */
    this.autoDel = autoDel

    /**
     * The COllection messages of this command
     * @type {Collection}
     * @readonly
     */
    this.messages = new Collection()

    this.push()
    this.client.emit('debug', `[DiscordBot => Command] ${this.name} Create`)
  }

  /**
   * Execute script command
   * @param {CommandMessage} [message] Instance of CommandMessage
   * @private
   * @param {Array} [args] Arguments
   */
  async execute (message, args) {
    return this.script(message, args).catch(error => this.client.handleError(error))
  }

  /**
   * Push this command to client & module commands collection
   * @private
   */
  push () {
    ['client', 'module'].forEach(collection => {
      if (!this[collection]) return
      this[collection].commands.set(this.id, this)
    })
  }
}

module.exports = Command

/**
 * Command Options.
 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/Snowflake}
 * @typedef {Object} CommandOptions
 * @property {Snowflake} [id] The id of this command
 * @property {string} [name] The name of command
 * @property {string} [description] The description of command
 * @property {Array} [alias] The alias array
 * @property {string} [group] The group name of command
 * @property {Function} [script] The script main function of command
 * @property {boolean} [autoDel] The status of this command
 */
