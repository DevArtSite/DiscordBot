module.exports = function () {
  console.log(`Main script function from module: "${this.name}", work!!`)
  // console.log(this)
  this.methods.beforeReady()
}
