const fs = require('fs')
const Commands = require('./Commands')
const Command = require('./Command')
module.exports = class Module {
  constructor (client, { id, name = null, path = null, author = null, disable = false }) {
    /**
     * The instance of DicordBot client
     * @name client
     * @type {DicordBot}
     * @readonly
     */
    this.client = client

    /**
     * The id of this module
     * @name id
     * @type {Snowflake}
     * @readonly
     */
    this.id = id

    /**
     * The name of this module
     * @name name
     * @type {String}
     * @readonly
     */
    this.name = name

    /**
     * The path of this module
     * @name path
     * @type {String}
     * @readonly
     */
    this.path = path

    /**
     * The author of this module
     * @name author
     * @type {String}
     * @readonly
     */
    this.author = author

    /**
     * The status of this module
     * @name disable
     * @type {Boolean}
     * @readonly
     */
    this.disable = disable

    /**
     * The main script of this module
     * @name script
     * @type {Function||null}
     * @readonly
     */
    this.script = (fs.existsSync(`${this.path}/index.js`)) ? require(this.path) : null

    /**
     * The methods of this module
     * @name methods
     * @type {Object}
     * @readonly
     */
    this.methods = (this.existFile('methods')) ? require(`${this.path}/methods`) : {}
    this.methods.self = this

    /**
     * Commands by inclusion of this module
     * @name _commands
     * @type {Array}
     * @readonly
     */
    this._commands = (this.existFile('commands')) ? require(`${this.path}/commands`) : []

    /**
     * Events by inclusion of this module
     * @name _events
     * @type {Array}
     * @readonly
     */
    this._events = (this.existFile('events')) ? require(`${this.path}/events`) : []

    /**
     * Commands by inclusion of this module
     * @name _commands
     * @type {Array}
     * @readonly
     */
    this.responses = (this.existFile('responses')) ? require(`${this.path}/responses`) : []

    /**
     * The commands Collection of this module
     * @name commands
     * @type {Commands}
     * @readonly
     */
    this.commands = new Commands(this)

    this.commandsInc()
    this.eventsInc()

    this.client.emit('debug', `[DiscordBot => Module] ${this.name} Create`)
  }

  /**
   * Check if the file or folder exists
   * @name existFile
   * @param {String} [name] Name of file/folder
   * @returns {Boolean}
   */
  existFile (name) {
    return (fs.existsSync(`${this.path}/${name}.js`) || fs.existsSync(`${this.path}/${name}`))
  }

  /**
   * Automatically adds the commands present in the array _commands
   * @name commandsInc
   */
  commandsInc () {
    if (!this._commands) return
    this._commands.forEach(_command => new Command(this, _command))
  }

  /**
   * Automatically adds the events present in the array _events
   * @name commandsInc
   */
  eventsInc () {
    if (!this._events) return
    Object.keys(this._events).forEach(_eventName => {
      this.client.on(_eventName, this._events[_eventName])
      this.client.emit('debug', `[DiscordBot => Module] ${this.name} Event ${_eventName} listening`)
    })
  }

  /**
   * Run the main script of this module
   * @name run
   */
  async run () {
    this.client.emit('debug', `[DiscordBot => Module] ${this.name} Run`)
    if (this.script) return this.script()
  }
}
