const { setActivity } = require('./responses')
const ready = async Bot => {
  const types = ['PLAYING', 'WATCHING', 'LISTENING']
  let i = 0
  await Bot.user.setActivity(setActivity(Bot.prefix), { type: types[types.length - 1] }).catch(error => Bot.handleError(error))
  setInterval(async () => {
    await Bot.user.setActivity(setActivity(Bot.prefix), { type: types[i] }).catch(error => Bot.handleError(error))
    if (i < types.length - 1) i++
    else i = 0
  }, 5000)
}
module.exports = { ready }
