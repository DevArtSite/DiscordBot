module.exports = {
  ready: async () => {
    const module = this.modules.find(({ name }) => name === 'Help')
    await this.user.setActivity(module.responses.setActivity(this.prefix), { type: 'LISTENING' }).catch(error => this.handleError(error))
  }
}