module.exports = {
  setActivity: index => `${index}h ${index}help`,
  title: (tag, group) => `:regional_indicator_h: Operating aid for ${(group) ? `${tag}, Section: ${group}` : tag}.`,
  description: index => `The commands must be preceded by the following prefix: \`\`${index}\`\``
}
