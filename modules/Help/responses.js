module.exports = {
  setActivity: index => `${index}h ${index}help`,
  title: (tag, group) => `:regional_indicator_h: Operating aid for ${(group) ? `${tag}, Section: ${group}` : tag}.`,
  description: prefix => `The commands must be preceded by the following prefix: \`\`${prefix}\`\``,
  contentlimited: 'La description de cette commande ne peut pas être affichée'
}
