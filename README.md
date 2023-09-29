# ue5-treasurehunt
This is an Unreal Engine sample project that drips ERC20 tokens in the game. This project was created as a part of the ApeCoinDAO's ThankApe props in the ApeCoin Developers: Build the Future of ApeCoin category'- https://prop.house/thank-ape/apecoin-developers:-build-the-future-of-apecoin

## Overview
This is a minimum setup for an Unreal Engine game client to receive blockchain token airdrops. To simplify the player experience, this project assumes players will enter their ETH addresses at the beginning of the game. Based on game mechanics, game server will airdrop blockchain tokens to player's wallet address. The game will only do passive airdrops (while server wallet pays gas fees).

You still need 3 parts:
- An Unreal Engine project: This 3rd person single player project is based on https://github.com/Sixze/ALS-Refactored (can be extended to multiplayer) and use https://github.com/ufna/VaRest to make REST calls.
- Smart Contracts (Solidity): While you can deploy your own contracts, here we have a test ERC20 token and a GamePrize Contract that will be controlled by a server operator to receive game events from the Unreal project.
- Serverless functions (firebase): In this sample project, we use Firebase Functions to be our server operator (that controls a server wallet) to manage smart contracts. Feel free to use other serverless solutions or setup your own server.

## Quick Start (Unreal Engine)
- Install Unreal Engine 5.2 https://www.unrealengine.com/en-US/
- Clone this repo
- Double-click on `TreasureHuntSample.uproject` to launch this project in Unreal Engine editor
- You are at `EntryMap` and click `Play`. 
- [opt-in] Enter/paste a desired ETH address. Or, you will be using project default ETH address to receive test ERC20 tokens.
- Click `START`. You are now in the `DefaultMap`
- Use `W, A, S, D` to move around. Drag mouse to rotate view. Click `Space bar` to jump.
- Touch the airdrop boxes to receive test ERC20 tokens.
- [intermediate] you can deploy your own contracts and serverless functions.

## Live implementation
You can see live demos related to this repo in Another World (https://anotherworld.gg/).

## Related Works
- [HyperPlay](https://www.hyperplay.xyz/)'s web3 game launcher SDK https://github.com/G7DAO/web3.unreal (player's wallet is in the launcher and the game can access it)