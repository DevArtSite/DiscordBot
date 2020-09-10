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
By default DiscordBot integrates a Help Module

#### options

 - `ggid` - **String** (*global guild id*) Id of the developer’s guild *(default "``null``")*
 - `gcid` - **String** (*global channel id*) Id of the developer’s channel on developer’s guild *(default "``null``")*
 - `dev` - **String** Name of the main developer *(default "``Anonymous``")*
 - `prefix` - **String** Character string to recognize a command of a message *(default "``&``")*
 - `dbname` - **String** Name of mongo database *(default "``null``")*
 - `customHelp` - **Object** object containing the title and custom description for the help command
   - `title` - **String** Title help command *(default "``null``")*
   - `description` - **String** Description help command *(default "``null``")*
 - `modulesPath` - **String** Your modules folder path *(default "``null``")*
 - `useDefaultModule` - **Boolean|Array** Module selection enabled *(default "``['*']``")*

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
