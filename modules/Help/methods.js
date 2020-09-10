module.exports = {
  help: async function (args) {
    const embedTitle = (tag, group = null) => (this.self.client.customHelp.title) ? this.self.client.customHelp.title(tag, group) : this.self.responses.title(tag, group)
    const embedDescr = prefix => (this.self.client.customHelp.description) ? this.self.client.customHelp.description(prefix) : this.self.responses.description(prefix)
    if (args.length === 0) {
      const groups = this.self.client.commands.groups()
      return Object.keys(groups).map(groupName => {
        const group = groups[groupName]
        const embed = this.self.client.MessageEmbed({ title: embedTitle(this.self.client.user.tag, groupName), description: embedDescr(this.self.client.prefix) })
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
      const embed = this.self.client.MessageEmbed({ title: embedTitle(this.self.client.user.tag), description: embedDescr(this.self.client.prefix) })
      const command = this.self.client.commands.find(command => command.alias.find(alias => cmd === alias))
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
