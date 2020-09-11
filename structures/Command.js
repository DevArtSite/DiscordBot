const { Snowflake } = require('discord.js')
/**
 * Represents the command.
 */
class Command {
  constructor (module, { alias = [], name = '', description = '', group = null, script = () => null, autoDel = true }) {
    /**
     * The instance of DicordBot client
     * @type {DicordBot}
     * @readonly
     */
    this.client = module.client

    /**
     * The instance of Module
     * @type {Module}
     * @readonly
     */
    this.module = module

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
    return await this.script(message, args).catch(error => this.client.handleError(error))
  }

  /**
   * Push this command to client & module commands collection
   * @private
   */
  push () {
    ['client', 'module'].forEach(collection => this[collection].commands.set(this.id, this))
  }
}

module.exports = Command
