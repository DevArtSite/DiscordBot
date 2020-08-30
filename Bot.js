const { Client, MessageEmbed } = require('discord.js')
const mongoose = require('mongoose')
module.exports = class Bot extends Client {
  constructor (options) {
    super()
    if (!options) throw new Error('Options required')
    if (!options.token) throw new Error('Options token required')
    if (!options.gid) throw new Error('Options gid required')
    if (!options.cid) throw new Error('Options cid required')
    if (!options.dev) throw new Error('Options dev required')
    this.token = options.token
    this.gid = options.gid
    this.cid = options.cid
    this.dev = options.dev
    this.prefix = options.prefix || '&'
    this.dbname = options.dbname || null

    this.customHelp = {
      title: options.customHelp.title || null,
      description: options.customHelp.description || null
    }

    this.dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    this.db = null

    this.Command = require('./Command')(this)
    this.Commands = require('./Commands')(this)
    this.Modules = require('./Modules')(this)

    this.commands = new this.Commands()
    this.modules = new this.Modules(options.modulesPath || null)
  }

  async connect () {
    if (!this.dbname) return
    const mongodb = await mongoose.connect(`mongodb://localhost:27017/${this.dbname}`, this.dbOptions).catch(error => this.handleError(error))
    this.db = mongodb.connection
    if (this.db.readyState !== 1) await new Promise(resolve => this.db.on('open', () => resolve(true)))
    this.emit('debug', '[Bot] Mongodb connected')
    return this.db
  }

  async login () {
    await this.connect().catch(error => this.handleError(error))
    await this.modules.init()
    await this.modules.start()
    return super.login(this.token)
  }

  on (event, cb) {
    return super.on(event, (...args) => cb(...args, this))
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

  MessageEmbed ({ title, description }) {
    if (!title) throw new Error('MessageEmbed title is required')
    if (!description) throw new Error('MessageEmbed description is required')
    const embed = new MessageEmbed()
      .setTitle(title)
      .setThumbnail(this.user.displayAvatarURL())
      .setColor('RANDOM')
      .setDescription(description)
      .setTimestamp(new Date())
      .setFooter(`${this.user.tag} | ${this.dev}`, this.user.displayAvatarURL())
    return embed
  }

  handleError (error) {
    if (!this.emit) throw error
    return this.emit('error', error)
  }
}
