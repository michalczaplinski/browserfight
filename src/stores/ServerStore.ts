import Peer from "peerjs";
import { observable, action, configure } from "mobx";
import uuid from 'uuid';
import {
  GameState,
  IConnections,
  Position,
  ServerData,
  isHandshakeFromClient,
  isDealDamageEvent,
  isUpdatePosition,
  ClientData
} from '../types';

// configure({ enforceActions: 'always' })

export class ServerStore {
  id: string = uuid.v1();

  @observable newPlayer: string = ""
  @observable error: any;
  @observable gameState: GameState = {
    [this.id]: { position: { x: 0, y: 30, z: 0 }, health: 100 }
  }
  connections: IConnections = {};
  peer: Peer;
  sendInterval: any;

  constructor() {

    this.peer = new Peer(this.id);

    this.peer.on("connection", conn => {
      this.connections[conn.peer] = conn;

      conn.on("open", () => {
        console.debug(`Connection to client established`);
        this.send("Hello from server");

        this.sendInterval = setInterval(
          () => this.send({ kind: 'updatePosition', id: this.id, position: this.gameState[this.id].position }),
          50);
      });

      conn.on("data", (data: ServerData) => {
        if (isHandshakeFromClient(data)) {
          console.debug(`Received handshake from client: ${data.kind}`);
          this.send({ kind: 'createPlayer', id: data.id });
          this.newPlayer = data.id;
          this.gameState[data.id] = { position: { x: 0, y: 30, z: 0 }, health: 100 }
          return;
        }

        // we accept the dealDamage events from all players
        if (isDealDamageEvent(data)) {
          this.send(data);
          this.gameState[data.id].health -= data.amount;
          return;
        }

        if (isUpdatePosition(data)) {
          this.send(data);
          this.gameState[data.id].position = data.position;
        }

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

  send(data: ClientData) {
    Object.values(this.connections).forEach(conn => {
      conn.send(data);
    });
  }

  updatePosition(data: Position) {
    this.gameState[this.id].position.x = data.x;
    this.gameState[this.id].position.y = data.y;
    this.gameState[this.id].position.z = data.z;
  }
}

export default ServerStore;
