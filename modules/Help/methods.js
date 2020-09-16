module.exports = {
  help: async function (args) {
    const customHelp = this.module.client.customHelp
    const embedTitle = (tag, group = null) => (customHelp.title) ? `${customHelp.emojis.title}${customHelp.title(tag, group)}` : `${customHelp.emojis.title}${this.module.responses.title(tag, group)}`
    const embedDescr = prefix => (customHelp.description) ? customHelp.description(prefix) : this.module.responses.description(prefix)
    const contentlimited = (customHelp.contentlimited) ? customHelp.contentlimited : this.module.responses.contentlimited
    const handleCommand = command => {
      let description = ''
      if (typeof command.description === 'object' && typeof command.description.length !== 'undefined') {
        description = command.description.map(d => `${d}\n`).toString().replace(/,/g, '')
      } else if (typeof command.description !== 'string') description = contentlimited
      return {
        name: command.name,
        value: `${description}\n${customHelp.emojis.alias}Alias: [\`\`${command.alias.toString()}\`\`]`
      }
    }

    if (args.length === 0) {
      const groups = this.module.client.commands.groups()c
      return Object.keys(groups).map(groupName => {
        const group = groups[groupName]
        const embed = this.module.client.MessageEmbed({ title: embedTitle(this.module.client.user.tag, groupName), description: embedDescr(this.module.client.prefix) })
        const fields = group.map(command => handleCommand(command))
        embed.addFields(fields)
        return embed
      })
    } else {
      const cmd = args[0]
      const embed = this.module.client.MessageEmbed({ title: embedTitle(this.module.client.user.tag), description: embedDescr(this.module.client.prefix) })
      const command = this.module.client.commands.find(command => command.alias.find(alias => cmd === alias))
      if (!command || (command.length && command.length === 0)) return
      embed.addFields([handleCommand(command)])
      return [embed]
    }
  }
}
