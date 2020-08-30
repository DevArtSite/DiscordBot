module.exports = {
  setActivity: index => `${index}h ${index}help`,
  title: (tag, group) => `:regional_indicator_h: Aide au fonctionnement de ${(group) ? `${tag}, Section: ${group}` : tag}.`,
  description: index => `Les commandes doivent êtres précédées du préfix suivant \`\`${index}\`\``
}
