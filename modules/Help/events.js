module.exports = {
  ready: async function () {
    const help = this.modules.resolveName('Help')
    await this.user.setActivity(help.responses.setActivity(this.prefix), { type: 'LISTENING' }).catch(error => this.handleError(error))
  }
}
