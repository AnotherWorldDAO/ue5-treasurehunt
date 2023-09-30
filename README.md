# Treasure Hunt 3D Game Sample Code
This is an Unreal Engine 5.2 sample project that drips ERC20 tokens during the gameplay. This project was created as a winner of the ApeCoinDAO's ThankApe props in the ApeCoin Developers: Build the Future of ApeCoin category'- https://prop.house/thank-ape/apecoin-developers:-build-the-future-of-apecoin

## Overview
This is a minimum setup for an Unreal Engine game client to receive blockchain token airdrops. To simplify the player experience, this project assumes players will enter their ETH addresses at the beginning of the game. Based on game mechanics, the game server will airdrop blockchain tokens to the player's wallet address. The game will only do passive airdrops (while the server wallet pays gas fees). Additional airdrop rules can be applied on the server side or on the contract side.

![image](https://github.com/AnotherWorldDAO/ue5-treasurehunt/assets/182446/f52b4bf2-0cab-42da-a379-8e1537a4c409)


A full setup requires the following parts:
- **An Unreal Engine project**: This 3rd person single player project is based on https://github.com/Sixze/ALS-Refactored (can be extended to multiplayer) and use https://github.com/ufna/VaRest to make REST calls.

- **Smart Contracts (Solidity)**: While you can deploy your own contracts, here we have a test ERC20 token and a GamePrize Contract that will be controlled by a server operator to receive game events from the Unreal project.

- **Serverless functions (firebase)**: In this sample project, we use Firebase Functions to be our server operator (that controls a server wallet) to manage smart contracts. Feel free to use other serverless solutions or set up your own server.


## Quick Start (Unreal Engine)
- Install Unreal Engine 5.2 https://www.unrealengine.com/en-US/
- Clone this repo or [download the latest release](https://github.com/AnotherWorldDAO/ue5-treasurehunt/releases)
- Double-click on `TreasureHuntSample.uproject` to launch this project in the Unreal Engine editor
- At `EntryMap`, click `Play` to run this game within the editor (check other Unreal beginner tutorials if you got stuck here)
- [opt-in] Enter/paste a desired ETH address. Or, you will be using the project's default ETH address to receive test ERC20 tokens.
- Click `START`. You are now in the `DefaultMap`
- Use `W, A, S, D` to move around. Drag the mouse to rotate the view. Click `Space bar` to jump
- Touch the airdrop boxes to receive test ERC20 tokens (via Goerli Testnet and Optimism Goerli Testnet)
- [intermediate] You can deploy your own contracts and serverless functions

## Live implementation
You can see live demos related to this repo in Another World (https://anotherworld.gg/): players enter ENS at the entry menu and will receive (limited) token airdrops.

## Related Works
- [HyperPlay](https://www.hyperplay.xyz/)'s web3 game launcher SDK https://github.com/G7DAO/web3.unreal (player's wallet is in the launcher and the game can access it)

## Any thoughts?
Contact `jackie.eth` https://twitter.com/JackieLeeETH

## Future works
- Have a multiplayer sample project and a setup manual
- Integrate ape 3d models

## Acknowledgement
- ThankApe ApeCoin grants https://prop.house/thank-ape
- ApeCoinDAO EthGlobal hackathon grants https://forum.apecoin.com/
- Optimism Growth Experiments grants https://gov.optimism.io/
- OnChainMonkey DAO grants https://prop.house/onchainmonkey
- Zech's ApeCoin 3D model https://prop.house/thank-ape/apecoin-designers:-design-the-future-of-apecoin/7111
- Ape fams and web3 frenz who have been supporting us!
