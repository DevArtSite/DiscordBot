const { Structures } = require('discord.js')
Structures.extend('Message', Message => require('./CommandMessage'))
