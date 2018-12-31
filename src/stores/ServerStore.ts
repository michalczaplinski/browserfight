import Peer from "peerjs";
import { observable } from "mobx";
import uuid from 'uuid';
import {
  GameState,
  IConnections,
  ClientGameState,
  GameStateFromServer,
  ServerData,
  isHandshakeFromClient,
  CreatePlayerEvent
} from '../types';


export class ServerStore {
  id: string = uuid.v1();

  @observable newPlayer: string = ""
  @observable error: any;
  @observable gameState: GameState = {
    [this.id]: { x: 0, y: 0, z: 0 }
  }
  connections: IConnections = {};
  peer: Peer;
  broadcastInterval: any;

  constructor() {

    this.peer = new Peer(this.id);

    this.peer.on("connection", conn => {
      this.connections[conn.peer] = conn;

      conn.on("open", () => {
        console.debug(`Connection to client established`);
        conn.send("Hello from server");

        this.broadcastInterval = setInterval(
          () => this.broadcast(this.gameState),
          1000 / 30);
      });

      conn.on("data", (data: ServerData) => {
        if (isHandshakeFromClient(data)) {
          console.debug(`Received handshake from client: ${data.kind}`);
          this.broadcast({ kind: 'createPlayer', id: data.id });
          this.newPlayer = data.id;
          return;
        }

        this.gameState[conn.peer] = { ...data };

      });

      conn.on("close", () => {
        delete this.connections[conn.peer];
        delete this.gameState[conn.peer];
      });

      // ERROR HANDLING
      conn.on("error", err => {
        this.error = err;
        console.log(err);
      });
    });
  }

  broadcast(data: GameStateFromServer | CreatePlayerEvent) {
    Object.values(this.connections).forEach(conn => {
      conn.send(data);
    });
  }

  updateState(data: ClientGameState) {
    this.gameState[this.id] = data;
  }
}

export default ServerStore;
