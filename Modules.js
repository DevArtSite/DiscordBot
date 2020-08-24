const fs = require('fs').promises
const path = require('path')
const { Collection } = require('discord.js')
module.exports = Bot => class Modules extends Collection {
  constructor (modulesPath) {
  	super()
    this.defaultPath = path.resolve(`${__dirname}/modules`)
  	this.modulesPath = path.resolve(modulesPath)
    this.Module = require('./Module')(Bot)
  }

  async load (modulesPath) {
    const modulesStats = await fs.stat(modulesPath).catch(error => Bot.handleError(error))
    if (!modulesStats || !modulesStats.isDirectory()) throw new Error(`${dir} must be a folder`)
    const modules = await fs.readdir(modulesPath).catch(error => Bot.handleError(error))
    const promises = modules.map(async name => {
      const path = `${modulesPath}/${name}`
      const options = require(`${path}/module.json`) || {}
      options.name = name
      options.path = path
      options.stats = await fs.stat(options.path).catch(error => Bot.handleError(error))
      if (!options.stats || !options.stats.isDirectory()) throw new Error('module must be a folder')
      if (this.get(options.name.toLowerCase())) throw new Error(`This module name ${options.name.toLowerCase()} already exist`)
      const mod = new this.Module(options)
      if (!options.disable) this.set(options.name.toLowerCase(), mod)
      return mod.init()
    })
    await Promise.all(promises).catch(error => Bot.handleError(error))
    return this
  }

  async init () {
    await this.load(this.defaultPath)
    await this.load(this.modulesPath)
  }

  async start () {
  	await Promise.all(this.map(async mod => await mod.start().catch(error => Bot.handleError(error)))).catch(error => Bot.handleError(error))
  }
}