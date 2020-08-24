const { Collection } = require('discord.js')
module.exports = Bot => class Commands extends Collection {
  add (commands) {
    if (typeof commands !== 'object' && !commands.length) throw new Error('commands must be an array')
    commands.forEach(command => {
      const Command = new Bot.Command(command)
      if (this.has(Command.id)) throw new Error('This command name already exist')
      this.set(Command.id, Command)
    })
  }

  regroup () {
  	const groups = {}
  	this.each(Command => {
  	  if (!groups[Command.group]) groups[Command.group] = new Collection()
  	  if (!groups[Command.group].has(Command.id)) groups[Command.group].set(Command.id, Command)
  	})
  	return groups
  }
}