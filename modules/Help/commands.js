const { title, description } = require('./responses')
module.exports = [{
  alias: ['h', 'help'],
  name: ':blue_circle: Help',
  description: [
    ':arrow_right: ``h`` ou ``help`` Vous fournis la liste complète des commandes.',
    ':arrow_right: ``h "command"`` ou ``help "command"`` Pour voir l\'aide pour une commande spécifique en remplacent "command" par l\'alias d\'une commande.',
    'Exemple: si vous fait un ``h help`` (pourquoi pas ^^) vous ne verrez que l\'aide de la commande "help"'
  ],
  group: 'help',
  script: async ({ Bot, message, args }) => {
    const embedTitle = (tag, group = null) => (Bot.customHelp.title) ? Bot.customHelp.title(tag, group) : title(tag, group)
    const embedDescr = prefix => (Bot.customHelp.description) ? Bot.customHelp.description(prefix) : description(prefix)
    if (args.length === 0) {
      const groups = Bot.commands.regroup()
      Object.keys(groups).map(groupName => {
        const group = groups[groupName]
        const embed = Bot.MessageEmbed({ title: embedTitle(Bot.user.tag, groupName), description: embedDescr(Bot.prefix) })
        const fields = group.map(command => {
          return {
            name: command.name,
            value: `${handleDescription(command.description)}\nAlias: [\`\`${command.alias.toString()}\`\`]`
          }
        })
        embed.addFields(fields)
        message.channel.send(`${message.member}`, embed).catch(error => Bot.handleError(error))
      })
    } else {
      const cmd = args[0]
      const embed = Bot.MessageEmbed({ title: embedTitle(Bot.user.tag), description: embedDescr(Bot.prefix) })
      const command = Bot.commands.find(command => command.alias.find(alias => cmd === alias))
      if (!command || (command.length && command.length === 0)) return
      embed.addFields([{
        name: command.name,
        value: `${handleDescription(command.description)}\nAlias: [\`\`${command.alias.toString()}\`\`]`
      }])
      message.channel.send(`${message.member}`, embed).catch(error => Bot.handleError(error))
    }
  }
}]

function handleDescription (desc) {
  if (typeof desc === 'object' && typeof desc.length !== 'undefined') {
    desc = desc.map(d => `${d}\n`).toString().replace(/,/g, '')
  } else if (typeof desc !== 'string') desc = 'La description de cette commande ne peut pas être affichée'
  return desc
}
