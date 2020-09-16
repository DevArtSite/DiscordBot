module.exports = [{
  alias: ['testMF'],
  name: ':blue_circle: Help',
  description: [
    ':arrow_right: ``h`` ou ``help`` Vous fournis la liste complète des commandes.',
    ':arrow_right: ``h "command"`` ou ``help "command"`` Pour voir l\'aide pour une commande spécifique.'
  ],
  group: 'help',
  script: async function (message, args) {
    return this.module.methods.test.me()
  }
}]
