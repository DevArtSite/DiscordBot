module.exports = {
  ready: async function (client) {
  	console.log(client)
    const help = client.modules.resolveName('Help')
    await client.user.setActivity(help.responses.setActivity(client.prefix), { type: 'LISTENING' }).catch(error => client.handleError(error))
  }
}
