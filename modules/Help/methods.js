module.exports = {
  help: async function (args) {
    const embedTitle = (tag, group = null) => (this.module.client.customHelp.title) ? this.module.client.customHelp.title(tag, group) : this.module.responses.title(tag, group)
    const embedDescr = prefix => (this.module.client.customHelp.description) ? this.module.client.customHelp.description(prefix) : this.module.responses.description(prefix)
    if (args.length === 0) {
      const groups = this.module.client.commands.groups()
      return Object.keys(groups).map(groupName => {
        const group = groups[groupName]
        const embed = this.module.client.MessageEmbed({ title: embedTitle(this.module.client.user.tag, groupName), description: embedDescr(this.module.client.prefix) })
        const fields = group.map(command => {
          return {
            name: command.name,
            value: `${handleDescription(command.description)}\n:regional_indicator_a: Alias: [\`\`${command.alias.toString()}\`\`]`
          }
        })
        embed.addFields(fields)
        return embed
      })
    } else {
      const cmd = args[0]
      const embed = this.module.client.MessageEmbed({ title: embedTitle(this.module.client.user.tag), description: embedDescr(this.module.client.prefix) })
      const command = this.module.client.commands.find(command => command.alias.find(alias => cmd === alias))
      if (!command || (command.length && command.length === 0)) return
      embed.addFields([{
        name: command.name,
        value: `${handleDescription(command.description)}\n:regional_indicator_a: Alias: [\`\`${command.alias.toString()}\`\`]`
      }])
      return [embed]
    }
  }
}

function handleDescription (desc) {
  if (typeof desc === 'object' && typeof desc.length !== 'undefined') {
    desc = desc.map(d => `${d}\n`).toString().replace(/,/g, '')
  } else if (typeof desc !== 'string') desc = 'La description de cette commande ne peut pas être affichée'
  return desc
}
