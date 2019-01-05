import Peer from "peerjs";
import { observable } from "mobx";
import uuid from "uuid";
import {
  GameState,
  ClientData,
  isCreatePlayerEvent,
  Position,
  isDealDamageEvent,
  ServerData,
  isUpdatePosition
} from '../types';

class ClientStore {
  id: string = uuid.v1()

  @observable newPlayer: string = ""
  @observable error: any;
  @observable loading: boolean = true;
  @observable gameState: GameState = {
    [this.id]: {
      position: { x: 0, y: 30, z: 0 },
      health: 100
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

      this.send({ kind: "Hello from client", id: this.id });

      this.sendInterval = setInterval(() => this.send(
        { kind: 'updatePosition', id: this.id, position: this.gameState[this.id].position }),
        100)

      this.connection.on("data", (data: ClientData) => {
        if (data === 'Hello from server') {
          console.debug(`Received handshake from server: ${data}`);
          this.newPlayer = serverId;
          return;
        }

        if (isCreatePlayerEvent(data)) {
          if (data.id !== this.id) {
            this.newPlayer = data.id;
            this.gameState[data.id] = {
              position: { x: 0, y: 30, z: 0 },
              health: 100
            }
          }
          return;
        }

        if (isDealDamageEvent(data)) {
          if (data.from !== this.id) {
            this.gameState[data.id].health -= data.amount;
          }
          return;
        }

        if (isUpdatePosition(data) && data.id !== this.id) {

          // if the player does not exist we gotta create them
          if (typeof this.gameState[data.id] === 'undefined') {
            this.gameState[data.id] = {
              position: data.position,
              health: 100
            }
            this.newPlayer = data.id;
          }
          this.gameState[data.id].position = data.position;
        }
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

  }

  send(data: ServerData) {
    this.connection.send(data);
  }

  updatePosition(data: Position) {
    this.gameState[this.id].position.x = data.x;
    this.gameState[this.id].position.y = data.y;
    this.gameState[this.id].position.z = data.z;
  }
}

export default ClientStore;
