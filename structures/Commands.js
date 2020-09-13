const { Collection } = require('discord.js')
/**
 * Represents the Commands Collection.
 * @extends {Collection}
 */
class Commands extends Collection {
  constructor (client) {
    super()

    /**
     * The instance of ClientDicordBot client
     * @type {ClientDicordBot}
     * @readonly
     */
    this.client = client
  }

  /**
   * Groups commands by group
   * @returns {Object<Command[]>}
   */
  groups () {
    const groups = {}
    this.each(Command => {
      if (!groups[Command.group]) groups[Command.group] = new Collection()
      if (!groups[Command.group].has(Command.id)) groups[Command.group].set(Command.id, Command)
    })
    return groups
  }
}

module.exports = Commands
