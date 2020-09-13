module.exports = {
  ready: function () {
    const module = this.modules.find(({ name }) => name === 'Test')
    console.log(`Event script function to "ready" event from module: "${module.name}", work!!`)
    module.methods.afterReady()
  }
}
