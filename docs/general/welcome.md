<h1 align="center">
  @devartsite/DiscordBot
</h1>
<p align="center">
  DiscordBot is a node.js module that allows you to build a Discord Bot easily<br>
  Easy to use, the important thing is to read our documentation
<p>
<p align="center">
  <a href="https://nodei.co/npm/@devartsite/discordbot"><img src="https://nodei.co/npm/@devartsite/discordbot.png?mini=true" alt="npm"></a>
</p>
<p align="center">  
  <a href="https://www.npmjs.com/package/@devartsite/discordbot"><img src="https://img.shields.io/npm/v/@devartsite/discordbot.svg" alt="npm version"></a>
  <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/devartsite/discordbot">
  <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/devartsite/discordbot">
  <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/devartsite/discordbot">
</p>
<p align="center">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/devartsite/discordbot">
  <img alt="Libraries.io dependency status for latest release, scoped npm package" src="https://img.shields.io/librariesio/release/npm/@devartsite/discordbot">
  <img alt="npm" src="https://img.shields.io/npm/dw/@devartsite/discordbot">
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/devartsite/discordbot?style=plastic">
  <img alt="npm collaborators" src="https://img.shields.io/npm/collaborators/@devartsite/discordbot">
  <img alt="NPM" src="https://img.shields.io/npm/l/@devartsite/discordbot">
</p>
<p align="center">
  <a href="https://discord.gg/gnx7ZAv"><img src="https://img.shields.io/discord/592890801575690259" alt="discord"></a>
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/devartsite/discordbot">
  <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/devartsite?style=plastic">
  <img alt="GitHub followers" src="https://img.shields.io/github/followers/devartsite?style=plastic">
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/devartsite/discordbot?style=plastic">
  <img alt="GitHub watchers" src="https://img.shields.io/github/watchers/devartsite/discordbot?style=plastic">
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/devartsite/discordbot?style=plastic">
</p>


# Welcome!

Welcome to the DiscordBot v2 documentation.

# About

Discord is an extend of discord.js.
 *discord.js is a powerful [Node.js](https://nodejs.org) module that allows you to easily interact with the
[Discord API](https://discord.com/developers/docs/intro).*

- *Object-oriented*
- *Predictable abstractions*
- *Performant*
- *100% coverage of the Discord API*

# Installation

**Node.js 12.0.0 or newer is required.**  
``` sh
npm i @devartsite/discordbot
```

# Basic example
``` js
const { DiscordBot, Command } = require('@devartsite/discordbot')

const client = new DiscordBot({
  ggid: 'my guild id',
  gcid: 'my channel id',
  dev: 'my name',
  prefix: '&prefix'
})

const myCommand = new Command(client, {
  alias: ['ping'],
  name: ':blue_circle: Ping',
  description: [
    ':arrow_right: ``ping`` Respond Pong!!.'
  ],
  group: 'ping',
  script: async function (message) {
    message.channel.send('Pong!!')
  }
})

client.login('my token').then(() => {
  console.log('Bot started and ready')
}).catch(console.error)
```
 - By default DiscordBot integrates a [Help Module](https://github.com/DevArtSite/DiscordBot/tree/master/modules/Help)


# Module implementation
```sh
DiscordBot-project
├── modules
│   ├── index.js
│   ├── commands.js
│   ├── methods.js
│   ├── responses.js
│   └── events.js
└── index.js
```

# Links

- [Website](https://discord.js.org/) ([source](https://github.com/discordjs/website))
- [discord.js Website](https://discord.js.org/) ([source](https://github.com/discordjs/website))
- [discord.js Documentation](https://discord.js.org/#/docs/main/master/general/welcome)


# Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Discord.js Server](https://discord.gg/bRCvFy9).