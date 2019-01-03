import Peer from "peerjs";
import { observable } from "mobx";
import uuid from "uuid";
import {
  ClientGameState,
  GameState,
  ClientData,
  isCreatePlayerEvent,
  Position,
  isDealDamageEvent
} from '../types';

class ClientStore {
  id: string = uuid.v1()

  @observable newPlayer: string = ""
  @observable error: any;
  @observable loading: boolean = true;
  @observable gameState: GameState = {
    [this.id]: {
      x: 0, y: 0, z: 0, health: 100
    }
  }
  sendInterval: any;
  connection: Peer.DataConnection;
  peer: Peer;

  constructor({ serverId }: { serverId: string }) {

    this.peer = new Peer(this.id);
    this.connection = this.peer.connect(serverId);

    this.connection.on("open", () => {
      this.loading = false;
      console.debug(`Connection to server established`)

      this.connection.send({ kind: "Hello from client", id: this.id });

      this.connection.on("data", (data: ClientData) => {
        if (data === 'Hello from server') {
          console.debug(`Received handshake from server: ${data}`);
          this.newPlayer = serverId;
          return;
        }
        if (isCreatePlayerEvent(data)) {
          if (data.id !== this.id) {
            this.newPlayer = data.id;
          }
          return;
        }
        if (isDealDamageEvent(data)) {
          this.gameState[data.id].health -= 10
          return;
        }

        delete data[this.id]

        Object.keys(data).forEach(playerId => {
          this.gameState[playerId] = data[playerId]
        })
      });

      this.connection.on("error", (err: any) => {
        this.error = err;
        console.log(err);
      });

      this.connection.on("close", () => {
        this.error = "The connection was closed";
      });

    });

    // ERROR HANDLING
    this.peer.on("error", (err: any) => {
      if (err.type === "peer-unavailable") {
        this.error = err;
      }
      console.error(err);
    });

    this.sendInterval = setInterval(() => this.send(this.gameState[this.id]))

  }

  send(data: ClientGameState) {
    this.connection.send(data);
  }

  updatePosition(data: Position) {
    this.gameState[this.id].x = data.x;
    this.gameState[this.id].y = data.y;
    this.gameState[this.id].z = data.z;
  }
}

export default ClientStore;
