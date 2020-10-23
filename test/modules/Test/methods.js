module.exports = {
  beforeReady: function () {
    console.log(`Methods script beforeReady function from module: "${this.module.name}", work!!`)
  },
  afterReady: function () {
    console.log(`Methods script afterReady function from module: "${this.module.name}", work!!`)
    const FolderMethods = this.client.modules.find(({ name }) => name === 'FolderMethods')
    FolderMethods.methods.test.me()
  }
}
