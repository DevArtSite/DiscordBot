const fs = require('fs').promises
const Path = require('path')
class ModuleMethods {
  constructor (client, module, path) {
    this.client = client
    this.module = module
    this.path = Path.resolve(path)
  }

  nameFormat (name, old = '') {
    name = name.charAt(0).toUpperCase() + name.slice(1)
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
    const stats = await fs.stat(this.path).catch(error => this.client.handleError(error))
    if (stats.isDirectory()) {
      const files = await fs.readdir(this.path).catch(error => this.client.handleError(error))
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
