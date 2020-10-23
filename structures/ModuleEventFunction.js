/**
 * Represents the event function in module’s.
 * @extends {Function}
 * @returns {Function} [callback] event function
 */
class ModuleEventFunction extends Function {
  constructor (client, module, callback) {
    super()
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
     * The callback function of event
     * @type {Function}
     * @readonly
     */
    this.callback = callback

    return this.callback
  }
}

module.exports = ModuleEventFunction
