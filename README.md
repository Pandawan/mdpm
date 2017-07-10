# MDPM - Minecraft Data Pack Manager
This is a package manager for Minecraft that installs Data Packs to your worlds.

## Installation
```bash
# With NPM
npm install mdpm -g

# With Yarn
yarn global add mdpm
```

## Usage
For now, there is no Official Repository, so you have to use direct links to your packages.
```bash
mdpm install <world> <packages...>

# Example: Will install the package found at https://path/to/my/pack in the world My World
mdpm install "My World" "https://path/to/my/pack"
```
This will install the packages as a data pack for the given world.  
Note: You can install more than one package at once.

## Help
```
# General help
mdpm --help

# Install help
mdpm install --help
```

## Resources
[How to make CLI with Node](https://developer.atlassian.com/blog/2015/11/scripting-with-node/)
