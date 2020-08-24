module.exports = Bot => class Command {
  constructor (options) {
    if (!options.alias || !options.alias.length) throw new Error('Command alias required and must be an array')
    if (!options.name || typeof options.name !== 'string') throw new Error('Command name required and must be an string')
    if (!options.description || !options.description.length) throw new Error('Command description required and must be an array')
    if (!options.script || typeof options.script !== 'function') throw new Error('Command script required and must be an function')

    this.alias = options.alias
    this.name = options.name
    this.group = options.group || null
    this.description = options.description
    this.script = options.script
    this.delete = options.delete || true

    this.id = options.name.toLowerCase()

    this.onMessage(async (message, command, args) => {
      await this.script({ message, command, args, Bot }).catch(error => Bot.handleError(error))
      if (this.delete) await message.delete().catch(error => Bot.handleError(error))
    })
    Bot.emit('debug', `[Bot => Command] ${this.name} Create`)
  }

  onMessage (cb) {
    Bot.on('message', message => {
      if (!message.guild) return
      let args = message.content.slice(Bot.prefix).split(' ')
      let command = args.shift().toLowerCase().replace(Bot.prefix, '')
      command = this.alias.find(str => str === command)
      if (!command) return

      Bot.emit('debug', `[Bot => Command] New command ${this.name}, ${(args.length > 0) ? `args: ${args.toString()}` : ''} by ${message.author.username}`)
      cb(message, command, args)
    })
  }
}