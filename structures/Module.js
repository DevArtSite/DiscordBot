const fs = require('fs')
const { Snowflake } = require('discord.js')
const Commands = require('./Commands')
const Command = require('./Command')
/**
 * Represents the Module.
 */
class Module {
  constructor (client, { name = null, path = null, author = null, disable = false, autostart = true }) {
    /**
     * The instance of ClientDicordBot client
     * @type {ClientDiscordBot}
     * @readonly
     */
    this.client = client

    /**
     * The id of this module
     * @type {Snowflake}
     * @readonly
     */
    this.id = Snowflake.generate()

    /**
     * The name of this module
     * @type {string}
     * @readonly
     */
    this.name = name

    /**
     * The path of this module
     * @type {string}
     * @readonly
     */
    this.path = path

    /**
     * The author of this module
     * @type {string}
     * @readonly
     */
    this.author = author

    /**
     * The status of this module
     * @type {boolean}
     * @readonly
     */
    this.disable = disable

    /**
     * Determines whether the module should be integrated into the bot when it login
     * @type {boolean}
     * @readonly
     */
    this.autostart = autostart
    /**
     * The main script of this module
     * @type {ModuleScriptFunction}
     * @readonly
     */
    this.script = (fs.existsSync(`${this.path}/index.js`)) ? require(this.path) : null

    /**
     * The methods of this module
     * @type {ModuleMethodsObject}
     * @readonly
     */
    this.methods = (this.existFile('methods')) ? require(`${this.path}/methods`) : {}
    this.methods.module = this

    /**
     * Commands by inclusion of this module
     * @type {Array}
     * @readonly
     */
    this._commands = (this.existFile('commands')) ? require(`${this.path}/commands`) : []

    /**
     * Events by inclusion of this module
     * @type {ModuleEventsObject}
     * @readonly
     */
    this._events = (this.existFile('events')) ? require(`${this.path}/events`) : []

    /**
     * Commands by inclusion of this module
     * @type {Array}
     * @readonly
     */
    this.responses = (this.existFile('responses')) ? require(`${this.path}/responses`) : []

    /**
     * The commands Collection of this module
     * @type {Commands}
     * @readonly
     */
    this.commands = new Commands(this)

    this.client.emit('debug', `[DiscordBot => Module] ${this.name} Create`)
  }

  /**
   * Check if the file or folder exists
   * @param {String} [name] Name of file/folder
   * @private
   * @returns {Boolean}
   */
  existFile (name) {
    return (fs.existsSync(`${this.path}/${name}.js`) || fs.existsSync(`${this.path}/${name}`))
  }

  /**
   * Run the main script of this module
   * @returns {Promise} ModuleScriptFunction
   */
  async run () {
    this.client.emit('debug', `[DiscordBot => Module] ${this.name} Run`)
    this._commands.forEach(_command => new Command(this, _command))
    Object.keys(this._events).forEach(_eventName => this.client.on(_eventName, this._events[_eventName]))
    if (!this.script) return
    return this.script()
  }
}

module.exports = Module

/**
 * Main function of a {@link Module}
 * ```js
 * // In this function "this" can be used end return the instance of the {@link Module}
 * async function () { }
 * // or
 * function () { }
 * // In this function "this" cannot be used and return that: {}, an object unusable
 * asyn () => { }
 * // or
 * () => { }
 * ```
 * - In this function "this" is the {@link Module} instance
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}
 * @typedef {Function} ModuleScriptFunction
 */

/**
 * The Methods object of a {@link Module}
 * ```js
 * ModuleMethodsObject = {
 *   myMethods: function () {
 *     // Can do stuff with "this.module"
 *   }
 * }
 * ```
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}
 * @typedef {Object<ModuleMethodsFunction>} ModuleMethodsObject
 */

/**
 * The ModuleMethodsFunction function of a {@link Module}
 * - In this function "this" is the methods object but when the {@link Module} is instantiated, it is transferred to the methods object
  * - To access to the module you need to use that in your function
 * ```js
 * this.module
 * ```
 * ```js
 * // In this function "this" can be used
 * async function () { }
 * function () { }
 * // In this function "this" cannot be used
 * async () => { }
 * () => { }
 * ```
 * - In this function "this" is the an object with "module" variable containing the {@link Module} instance
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}
 * @typedef {Function} ModuleMethodsFunction
 */

/**
 * The ModuleEventsObject is object which lists the functions to associate to the available event
 * ```js
 * ModuleEventsObject = {
 *   ready: function () {
 *    // do stuff
 *   }
 * }
 * ```
 * @see {@link https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-ready}
 * @typedef {Object<ModuleEventFunction>} ModuleEventsObject
 */

/**
 * The ModuleEventFunction is a function
 * - To access to the module you need to use that in your function
 * ```js
 * const module = this.modules.find(({ name }) => name === 'My module name')
 * ```
 * - In this function "this" is the {@link ClientDiscordBot} instance
 * ```js
 * // In this function "this" can be used
 * async function () { }
 * function () { }
 * // In this function "this" cannot be used
 * async () => { }
 * () => { }
 * ```
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}
 * @typedef {Function} ModuleEventFunction
 */
