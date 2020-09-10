const { Collection } = require('discord.js')
/**
 * Represents the Commands Collection.
 * @extends {Collection}
 */
class Commands extends Collection {
  constructor (client) {
    super()

    /**
     * The instance of DicordBot client
     * @type {DicordBot}
     * @readonly
     */
    this.client = client
  }

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
