const fs = require('fs')
module.exports = Bot => class Module {
  constructor (options) {
    if (!options.name) throw new Error('Module name undefined')
    if (!options.path) throw new Error('Module path undefined')

    this.name = options.name
    this.path = options.path

    this.author = options.author || null
    this.disable = options.disable || false

    this.script = null
    this.api = null
    Bot.emit('debug', `[Bot => Module] ${this.name} Create`)
  }

  async init () {
    if (this.disable) return
    Bot.emit('debug', `[Bot => Module] ${this.name} Init`)
    this.script = require(this.path)
    this.api = (fs.existsSync(`${this.path}/api.js`)) ? require(`${this.path}/api`)(Bot) : null
  }

  async start () {
    if (this.disable) return
    Bot.emit('debug', `[Bot => Module] ${this.name} Start`)
    return this.script.run(Bot)
  }
}
