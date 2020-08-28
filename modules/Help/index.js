exports.run = async Bot => {
  Bot.commands.add(require('./commands'))
  Bot.addEvent(require('./events'))
}
