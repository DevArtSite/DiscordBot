const ModuleMethod = require('../../../../structures/ModuleMethod')
module.exports = {
  me: function () {
    console.log('me function in FolderMethods module is an instance of ModuleMethod: ', this instanceof ModuleMethod)
  }
}
