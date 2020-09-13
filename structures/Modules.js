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
     * The instance of ClientDicordBot client
     * @type {ClientDicordBot}
     * @readonly
     */
    this.client = client

    /**
     * The string path to custom modules folder
     * @type {resolvedPath}
     * @readonly
     */
    this.modulesPath = path.resolve(modulesPath)

    /**
     * The string path to default modules folder
     * @type {resolvedPath}
     * @private
     * @readonly
     */
    this.defaultPath = path.resolve(`${__dirname}/../modules`)
  }

  /**
   * Instantiates all new modules in the module folder
   * @private
   * @param {resolvedPath} [modulesPath] Resolved path to module folder
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
   * @param {resolvedPath} [path] Resolved path to module folder
   * @param {string} [name] Name of module
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
   * @private
   * @param {resolvedPath} [path] Resolved path to default module folder
   * @param {string} [name] Name of module
   * @returns {boolean}
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
   * Call default and custom module instantiation when client login
   * @private
   */
  async init () {
    await this.load(this.defaultPath)
    if (this.modulesPath) await this.load(this.modulesPath)
  }

  /**
   * Runs the main scripts of all modules when client login
   * @private
   */
  async start () {
    await Promise.all(this.map(async mod => {
      if (!mod.autostart) return
      await mod.run().catch(error => this.client.handleError(error))
    })).catch(error => this.client.handleError(error))
  }
}

module.exports = Modules

/**
 * Path resolved with "resolve" function from node.js module "path"
 * @see {@link https://nodejs.org/api/path.html#path_path_resolve_paths}
 * @typedef {string} resolvedPath
 */
