const ModuleEventFunction = require('../../../structures/ModuleEventFunction')
module.exports = {
  ready: function () {
    console.log('Ready event in Test instance of ModuleEventFunction: ', this instanceof ModuleEventFunction)

    const Test = this.modules.resolveName('Test')
    console.log(`Event script function to "ready" event from module: "${Test.name}", work!!`)
    Test.methods.afterReady()
  }
}
