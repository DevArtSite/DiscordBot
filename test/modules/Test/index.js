module.exports = function () {
  console.log(`Main script function from module: "${this.name}", work!!`)
  this.methods.beforeReady()
}
