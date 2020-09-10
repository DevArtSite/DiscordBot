const ready = async function () {
  const self = this.modules.find(module => module.name === 'Help')
  const types = ['PLAYING', 'WATCHING', 'LISTENING']
  let i = 0
  await this.user.setActivity(self.responses.setActivity(this.prefix), { type: types[types.length - 1] }).catch(error => this.handleError(error))
  setInterval(async () => {
    await this.user.setActivity(self.responses.setActivity(this.prefix), { type: types[i] }).catch(error => this.handleError(error))
    if (i < types.length - 1) i++
    else i = 0
  }, 5000)
}
module.exports = { ready }
