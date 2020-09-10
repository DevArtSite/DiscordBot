const { Collection } = require('discord.js')
module.exports = class Commands extends Collection {
  constructor (client) {
    super()
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
