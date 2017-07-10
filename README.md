# Minecraft Package manager

This is a package manager for Minecraft that installs Data Packs to your worlds.

## Installation
```bash
# With NPM
npm install mcpm -g

# With Yarn
yarn global add mcpm
```

## Usage
```bash
mcpm install <world> <packages...>

# Example: Will install the package found at https://path/to/my/pack in the world My World
mcpm install "My World" "https://path/to/my/pack"
```
This will install the packages as a data pack for the given world.  
Note: You can install more than one package at once.

## Help
```
# General help
mcpm --help

# Install help
mcpm install --help
```

## Resources
[How to make CLI with Node](https://developer.atlassian.com/blog/2015/11/scripting-with-node/)
