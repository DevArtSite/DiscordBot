/**
 * Represents the methods of module.
 */
class ModuleMethod {
  /**
   * The instance of ModuleMethod
   * @type {ModuleMethod}
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

    /**
     * The methods object cache
     * @type {Object}
     * @private
     */
    this._methods = methods

    this.autoIncrement()
  }

  /**
   * Auto increment of module methods from cache
   * @private
   * @return {Void}
   */
  autoIncrement () {
    Object.keys(this._methods).forEach(key => {
      const methods = this._methods[key]
      if (typeof methods === 'function') this[key] = methods
      else if (typeof methods === 'object') this[key] = new ModuleMethod(this.client, this.module, methods)
      else throw new Error('methods must be an object or function')
    })
  }
}
module.exports = ModuleMethod
