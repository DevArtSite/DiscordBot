const { Snowflake, Collection } = require('discord.js')
/**
 * Represents the command.
 * @param {ClientDiscordBot|Module} [module] Should be Module if is command from module or Client if is a command out of module context
 * @param {CommandOptions} [data] Data for command
 */
class Command {
  constructor (moduleOrClient, { alias, name, description, group = null, script, autodelete = true }) {
    /**
     * The instance of DicordBot client
     * @type {ClientDiscordBot}
     * @readonly
     */
    this.client = (!moduleOrClient.client) ? moduleOrClient : moduleOrClient.client

    /**
     * The instance of Module
     * @type {Module}
     * @readonly
     */
    this.module = (!moduleOrClient.client) ? null : moduleOrClient

    /**
     * The id of this command
     * @type {Snowflake}
     * @readonly
     */
    this.id = Snowflake.generate()

    /**
     * The name of command
     * @type {string}
     * @readonly
     */
    this.name = name

    /**
     * The description of command
     * @type {string}
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
     * @type {string}
     * @readonly
     */
    this.group = group

    /**
     * The script function of command
     * @type {CommandScriptFunction}
     * @readonly
     */
    this.script = script

    /**
     * The status of this command
     * @type {boolean}
     * @readonly
     */
    this.autodelete = autodelete

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
   * Push this command to client & module commands collection if available
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
 * @property {boolean} [autodelete] The status of this command
 */

/**
 * Main function of a command
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}
 * @typedef {Async} CommandScriptFunction
 * ``
 *   // In this function "this" can be used
 *   async function () { }
 *
 *   // In this function "this" cannot be used
 *   async () => { }
 * ``
 */
