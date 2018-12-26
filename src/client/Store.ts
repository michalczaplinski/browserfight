import Peer from "peerjs";
import { observable } from "mobx";
import uuid from "uuid";


interface DataFromServer {
  players?: {
    [key: string]: {
      x_pos: number
      y_pos: number
    }
  }
}

interface DataFromClient {
  x_pos: number
  y_pos: number
}

class ClientStore {
  @observable data: DataFromServer = {};
  @observable error: any;
  @observable loading: boolean = true;

  connection: Peer.DataConnection;
  peer: Peer;

  constructor({ serverId }: { serverId: string }) {

    this.peer = new Peer(uuid.v1());
    this.connection = this.peer.connect(serverId);

    this.connection.on("open", () => {
      this.loading = false;
      console.debug(`Connection to server established`)

      this.connection.send("Hello from client");

      this.connection.on("data", (data: DataFromServer) => {
        this.data = data;
        if (data === 'Hello from server') {
          console.debug(`Received handshake from server: ${data}`);
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

  send(data: DataFromClient) {
    this.connection.send(data);
  }
}

export default ClientStore;
