const fs = require('fs')
const { Snowflake } = require('discord.js')
const Commands = require('./Commands')
const Command = require('./Command')
/**
 * Represents the Module.
 */
class Module {
  constructor (client, { name = null, path = null, author = null, disable = false }) {
    /**
     * The instance of ClientDicordBot client
     * @type {ClientDicordBot}
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
     * The main script of this module
     * @type {Function}
     * @readonly
     */
    this.script = (fs.existsSync(`${this.path}/index.js`)) ? require(this.path) : null

    /**
     * The methods of this module
     * @type {Object}
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
     * @type {Object}
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
    return this.scriptInc()
  }
}

module.exports = Module

/**
 * Main function of a module
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}
 * @typedef {Async} ModuleScriptFunction
 * @example
 * // In this function "this" can be used
 * async function () { }
 * @example
 * // In this function "this" cannot be used
 * async () => { }
 */
