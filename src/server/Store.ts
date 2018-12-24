import Peer, { DataConnection } from "peerjs";
import { extendObservable, decorate, observable } from "mobx";
import uuid from 'uuid';

interface IConnections {
  [propName: string]: DataConnection
}

export class ServerStore {
  @observable x_pos: number = 0;
  @observable y_pos: number = 0;
  @observable connections: IConnections = {};
  @observable id: string = uuid.v1();
  @observable error: any;

  peer: Peer;

  constructor() {

    this.peer = new Peer(this.id);

    this.peer.on("connection", conn => {
      this.connections[conn.peer] = conn;

      conn.on("open", () => {
        conn.send("Hello from server");
      });

      conn.on("data", data => {
        console.log("data from client", data);
        this.x_pos = data.x_pos;
        this.y_pos = data.y_pos;
      });

      conn.on("close", () => {
        delete this.connections[conn.peer];
      });

      // ERROR HANDLING
      conn.on("error", err => {
        this.error = err;
        console.log(err);
      });
    });
  }

  // broadcast(data) {
  //   Object.values(this.connections).forEach(conn => {
  //     conn.send(data);
  //   });
  // }
}

export default ServerStore;
