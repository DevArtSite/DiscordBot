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
  constructor (client, module, path) {
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
    this.path = (fs.existsSync(`${path}.js`)) ? Path.resolve(`${path}.js`) : Path.resolve(path)
  }

  nameFormat (name, old = '') {
    return `${old}${name}`
  }

  increment (methods, oldName = null) {
    Object.keys(methods).forEach(key => {
      const name = this.nameFormat(key, oldName || '')
      if (typeof methods[key] === 'function') this[name] = methods[key]
      else if (typeof methods[key] === 'object') {
        this[name] = this.increment(methods[key], name)
      }
    })
    return this
  }

  async init () {
    const stats = await fsp.stat(this.path).catch(error => this.client.handleError(error))
    if (stats.isDirectory()) {
      const files = await fsp.readdir(this.path).catch(error => this.client.handleError(error))
      files.forEach(f => {
        if (f.split('.')[0] !== 'index') {
          this.increment(require(`${this.path}/${f.split('.')[0]}`), f.split('.')[0])
        }
      })
    } else this.increment(require(this.path))
    return this
  }
}
module.exports = ModuleMethods
