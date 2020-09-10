<h1 align="center">
  @devartsite/DiscordBot
</h1>
<p align="center">
  <a href="https://nodei.co/npm/@devartsite/discordbot"><img src="https://nodei.co/npm-dl/@devartsite/discordbot.png?months=5&height=2" alt="npm"></a>
  <a href="https://nodei.co/npm/@devartsite/discordbot"><img src="https://nodei.co/npm/@devartsite/discordbot.svg" alt="npm"></a>
</p>
<p align="center">  
  <a href="https://www.npmjs.com/package/@devartsite/discordbot"><img src="https://img.shields.io/npm/v/@devartsite/discordbot.svg" alt="npm version"></a>
  <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/devartsite/discordbot">
  <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/devartsite/discordbot">
  <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/devartsite/discordbot">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/devartsite/discordbot">
  <img alt="Libraries.io dependency status for latest release, scoped npm package" src="https://img.shields.io/librariesio/release/npm/@devartsite/discordbot">
  <img alt="npm" src="https://img.shields.io/npm/dw/@devartsite/discordbot">
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/devartsite/discordbot?style=plastic">
  <img alt="npm collaborators" src="https://img.shields.io/npm/collaborators/@devartsite/discordbot">
  <img alt="NPM" src="https://img.shields.io/npm/l/@devartsite/discordbot">
</p>
<p align="center">
  <a href="https://discord.gg/3hGMPw"><img src="https://img.shields.io/discord/592890801575690259" alt="discord"></a>
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/devartsite/discordbot">
  <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/devartsite?style=plastic">
  <img alt="GitHub followers" src="https://img.shields.io/github/followers/devartsite?style=plastic">
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/devartsite/discordbot?style=plastic">
  <img alt="GitHub watchers" src="https://img.shields.io/github/watchers/devartsite/discordbot?style=plastic">
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/devartsite/discordbot?style=plastic">
</p>
<p align="center">
  DiscordBot is a node.js module that allows you to build a Discord Bot easily<br>
  Easy to use, the important thing is to read our documentation
<p>

## Installation
To install DiscordBot:
``` sh
npm i @devartsite/discordbot
```

## Basic example
``` js
const DiscordBot = require('@devartsite/discordbot')
const client = new DiscordBot({ DiscordBotOptions })
client.login(token)
```
Options
```js
  DiscordBotOptions = {
    // The ggid (global guild id) is the id of the developer’s guild
    ggid: {
      type: String,
      default: null
    },
    // The gcid (global channel id) is the id of the developer’s channel on developer’s guild
    gcid: {
      type: String,
      default: null
    },
    // The dev is the name of the main developer
    dev: {
      type: String,
      default: 'Anonymous'
    },
    // The prefix is a character string to recognize a command of a message
    prefix: {
      type: String,
      default: '&'
    },
    // The dbname is a name of mongo database
    dbname: {
      type: String,
      default: null
    },
    // The customHelp is an object containing the title and custom description for the help command
    customHelp: {
      title: {
        type: String,
        default: null
      },
      description: {
        type: String,
        default: null
      }
    },
    // The modulesPath is your modules folder path
    modulesPath: {
      type: String,
      default: null
    },
    // Default module selection enabled
    useDefaultModule: {
      type: Boolean || Array,
      default: ['*']
    }
  }
```

## Module implementation
```sh
YourDiscordBot
├── modules
│   ├── index.js
│   ├── commands.js
│   ├── methods.js
│   ├── responses.js
│   └── events.js
└── index.js
```
