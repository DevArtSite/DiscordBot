const { MessageEmbed  } = require('discord.js')
const { title, description } = require('./responses')
module.exports = [{
  alias: ['h', 'help'],
  name: 'Help',
  description: 'Vous fournis la liste des commandes.',
  group: 'help',
  script: async ({ Bot, message, args }) => {
  	if (args.length === 0) {
      const groups = Bot.commands.regroup()
      Object.keys(groups).map(groupName => {
        const group = groups[groupName]
        const embed = Bot.MessageEmbed({ title: title(`${Bot.user.tag}, Section: ${groupName}`), description: description(Bot.prefix) })
        const fields = group.map(command => { return { name: command.name, value: `${command.description}\nCommandes: [\`\`${command.alias.toString()}\`\`]` } })
        embed.addFields(fields)
        message.channel.send(`${message.member}`, embed).catch(error => Bot.handleError(error))
      })
  	} else {
  	  let cmd = args[0]
  	  const embed = Bot.MessageEmbed({ title: title(Bot.user.tag), description: description(Bot.prefix) })
  	  const command = Bot.commands.find(command => command.alias.find(alias => cmd === alias))
      embed.addFields([{ name: command.name, value: `${command.description}\nCommandes: [\`\`${command.alias.toString()}\`\`]` }])
  	  message.channel.send(`${message.member}`, embed).catch(error => Bot.handleError(error))
    }
  }
}]