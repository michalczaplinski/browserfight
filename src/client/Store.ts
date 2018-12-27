import Peer from "peerjs";
import { observable } from "mobx";
import uuid from "uuid";
import { DataFromServer, DataFromClient, Handshake, GameState } from '../types';

class ClientStore {
  id: string = uuid.v1()
  @observable gameState: GameState = {
    [this.id]: {
      x: 0, y: 0, z: 0
    }
  }
  @observable error: any;
  @observable loading: boolean = true;

  sendInterval: any;
  connection: Peer.DataConnection;
  peer: Peer;

  constructor({ serverId }: { serverId: string }) {

    this.peer = new Peer(this.id);
    this.connection = this.peer.connect(serverId);

    this.connection.on("open", () => {
      this.loading = false;
      console.debug(`Connection to server established`)

      this.connection.send("Hello from client");

      this.connection.on("data", (data: DataFromServer | Handshake) => {
        if (data === 'Hello from server') {
          console.debug(`Received handshake from server: ${data}`);
        }
        if (typeof data === "string") {
          return;
        }
        delete data[this.peer.id]
        this.gameState = { ...data, ...this.gameState };
      });

      this.connection.on("error", (err: any) => {
        this.error = err;
        console.log(err);
      });

      this.connection.on("close", () => {
        this.error = "The connection was closed";
      });

      // this.sendInterval = setInterval(
      //   () => this.send(this.gameState[this.peer.id])
      //   , 1000 / 30);
    });

    // ERROR HANDLING
    this.peer.on("error", (err: any) => {
      if (err.type === "peer-unavailable") {
        this.error = err;
      }
      console.error(err);
    });

  }

  send(data: DataFromClient) {
    this.connection.send(data);
  }

  updateState(data: DataFromClient) {
    this.gameState[this.peer.id] = data;
  }
}

export default ClientStore;
