const fs = require('fs')
const fsp = fs.promises
const Path = require('path')
/**
 * Represents the methods of module.
 */
class ModuleMethods {
  /**
   * The instance of ModuleMethods
   * @type {ModuleMethods}
   * @readonly
   */
  constructor (client, module, methods) {
    /**
     * The instance of ClientDicordBot client
     * @type {ClientDiscordBot}
     * @readonly
     */
    this.client = client

    /**
     * The id of this module
     * @type {Module}
     * @readonly
     */
    this.module = module

    this._methods = methods
  }

  increment (methods, oldName = null) {
    if (oldName) this[oldName] = methods
    else Object.keys(methods).forEach(key => {
      this[key] = methods[key]
    })
  }

  async init () {
    const stats = await fsp.stat(this.path).catch(error => this.client.handleError(error))
    if (stats.isDirectory()) {
      const files = await fsp.readdir(this.path).catch(error => this.client.handleError(error))
      files.forEach(f => (f.split('.')[0] !== 'index') ? this.increment(require(`${this.path}/${f.split('.')[0]}`), f.split('.')[0]) : null)
    } else this.increment(require(this.path))
    return this
  }
}
module.exports = ModuleMethods
