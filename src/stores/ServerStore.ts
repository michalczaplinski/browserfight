import Peer, { DataConnection } from "peerjs";
import { observable } from "mobx";
import uuid from 'uuid';
import { GameState, IConnections, DataFromServer, DataFromClient, Handshake } from '../types';


export class ServerStore {
  id: string = uuid.v1();

  @observable gameState: GameState = {
    [this.id]: { x: 0, y: 0, z: 0 }
  }
  @observable error: any;

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

      conn.on("data", (data: DataFromClient | Handshake) => {
        if (data === 'Hello from client') {
          console.debug(`Received handshake from client: ${data}`);
        }
        if (typeof data === 'string') {
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

  broadcast(data: DataFromServer) {
    Object.values(this.connections).forEach(conn => {
      conn.send(data);
    });
  }

  updateState(data: DataFromClient) {
    this.gameState[this.peer.id] = data;
  }
}

export default ServerStore;
