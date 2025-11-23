# Race Game

![Preview](/public/img/preview.webp)

The objective is to reach the finish line first. For every round, players must pick a number between one through four. If any player chooses the same number as another player, they do not advance. The number chosen is the number of spaces that player advances.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Extra steps are required to get multiplayer via websockets working but this documentation is still being worked on.

## Multiplayer

Two types of multiplayer networking for this game

- Websocket Server via socket.io 
- WebRTC via peerjs

Game Server Types

- **Room Play** - Non-player Peer host with single shared screen for players.  
- **Peer Multiplayer** - Player Peer host, all players render their own game.
- **Socket Multiplayer** - Server hosted games, enables anti cheat, saved stats, rewards, server browser.  

When joining games a server_type is set that handles the different logic needed

## Roadmap

- Dynamic lane logic for any combination of player count and move count
- Finish socket multiplayer logic
- Finish game chat
- Arcade Mode
- AMCOT MMO Intergration - Mini-game logic
- ToonTown Mode - Reskins game to be ToonTown graphics

## Inspiration

Inspired by the Race Game from [Disney's ToonTown Online](https://toontownrewritten.fandom.com/wiki/Race_Game)

## Attributions

Windmill Model: [TODO](https://google.com)  
Player Models: [TODO](https://google.com)  
Bleacher Model: [TODO](https://google.com)  
Tree Model: [TODO](https://google.com)  
Boat Model: [TODO](https://google.com)  
Grass Texture: [TODO](https://google.com)  
Water Texture: [TODO](https://google.com)  