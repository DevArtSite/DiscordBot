const fs = require('fs')
const path = require('path')
const files = fs.readdirSync(path.resolve(__dirname))
const methods = module.exports
files.forEach(f => {
  if (f.split('.')[0] !== 'index' && f.split('.')[1] === 'js') {
    methods[f.split('.')[0]] = require(`${__dirname}/${f.split('.')[0]}`)
    methods[f.split('.')[0]].module = () => methods.module
  }
})