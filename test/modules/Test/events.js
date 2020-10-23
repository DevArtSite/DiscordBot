module.exports = {
  ready: function (client) {
    const module = client.modules.find(({ name }) => name === 'Test')
    console.log(`Event script function to "ready" event from module: "${module.name}", work!!`)
    module.methods.afterReady()
  }
}
