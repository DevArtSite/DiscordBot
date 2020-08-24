exports.run = async Bot => {
  console.log('Add help module')
  Bot.commands.add(require('./commands'))
  Bot.addEvent(require('./events'))
}