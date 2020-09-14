module.exports = {
  setActivity: index => `${index}h ${index}help`,
  title: (tag, group) => `Operating aid for ${(group) ? `${tag}, Section: ${group}` : tag}.`,
  description: prefix => `The commands must be preceded by the following prefix: \`\`${prefix}\`\``,
  contentlimited: 'The description of this command cannot be displayed'
}
