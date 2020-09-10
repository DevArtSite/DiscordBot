const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const { Collection } = require('discord.js')
const Module = require('./Module')

/**
 * Represents the DiscordBot modules Collection.
 * @extends {Collection}
 */
class Modules extends Collection {
  constructor (client, modulesPath = null) {
    super()
    if (!modulesPath) client.emit('warn', '[DiscordBot => Modules] Warning - modulesPath options must be set to use your custom modules')

    /**
     * The instance of DicordBot client
     * @type {DicordBot}
     * @readonly
     */
    this.client = client

    /**
     * The string path to custom modules folder
     * @type {String}
     * @readonly
     */
    this.modulesPath = path.resolve(modulesPath)

    /**
     * The string path to default modules folder
     * @type {String}
     * @readonly
     */
    this.defaultPath = path.resolve(`${__dirname}/../modules`)
  }

  /**
   * Instantiates all new modules in the module folder
   * @param {modulesPath} [modulesPath] Path to module folder
   */
  async load (modulesPath) {
    const modulesStats = await fsp.stat(modulesPath).catch(error => this.client.handleError(error))
    if (!modulesStats || !modulesStats.isDirectory()) throw new Error(`${modulesPath} must be a folder`)
    const modules = await fsp.readdir(modulesPath).catch(error => this.client.handleError(error))
    const promises = modules.map(name => this.instanciate(modulesPath, name))
    await Promise.all(promises).catch(error => this.client.handleError(error))
  }

  /**
   * Instantiate a new module
   * @param {String} [path] Path to module folder
   * @param {String} [name] Name of module
   */
  async instanciate (path, name) {
    if (!this.isDefaultEnabled(path, name)) return
    path = `${path}/${name}`
    const stats = await fsp.stat(path).catch(error => this.client.handleError(error))
    if (!stats || !stats.isDirectory()) throw new Error('module must be a folder')

    const data = (fs.existsSync(`${path}/module.json`)) ? require(`${path}/module.json`) : {}
    Object.assign(data, { name, path })
    const mod = new Module(this.client, data)
    if (this.get(mod.id)) throw new Error(`This module name ${name} with id "${mod.id}" already exist`)
    if (!data.disable) this.set(mod.id, mod)
  }

  /**
   * Test if it is a default module and should be enabled
   * @param {String} [path] Path to default module folder
   * @param {String} [name] Name of module
   * @returns {Boolean}
   */
  isDefaultEnabled (path, name) {
    return !(path === this.defaultPath &&
      (!this.client.useDefaultModule ||
        (
          (this.client.useDefaultModule.length !== 1 || this.client.useDefaultModule[0] !== '*') &&
          (
            (this.client.useDefaultModule.length === 1 && this.client.useDefaultModule[0] !== name) ||
            (this.client.useDefaultModule.length > 1 && !this.client.useDefaultModule.find(module => module === name))
          )
        )
      )
    )
  }

  /**
   * Call default and custom module instantiation
   */
  async init () {
    await this.load(this.defaultPath)
    if (this.modulesPath) await this.load(this.modulesPath)
  }

  /**
   * Runs the main scripts of all modules
   */
  async start () {
    await Promise.all(this.map(async mod => await mod.run().catch(error => this.client.handleError(error))))
      .catch(error => this.client.handleError(error))
  }
}

module.exports = Modules
