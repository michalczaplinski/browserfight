import Peer from "peerjs";
import { observable, decorate } from "mobx";

class ServerStore {
  x_pos = 0;
  y_pos = 0;
  connections = [];

  peer;
  id;
  error;

  stop() {
    this.peer.destroy();
  }

  constructor() {
    this.peer = new Peer();

    this.peer.on("open", id => {
      this.id = id;
    });

    this.peer.on("connection", conn => {
      this.connections.push(conn);

      conn.on("open", () => {
        conn.send("Hello from server");
      });

      conn.on("data", data => {
        console.log("data from client", data);
        this.x_pos = data.x_pos;
        this.y_pos = data.y_pos;
      });

      conn.on("close", () => {
        // TODO: check which connection was closed and remove it from the list of connections
      });

      // ERROR HANDLING
      conn.on("error", err => {
        this.error = err;
        console.log(err);
      });
    });
  }
}

export default decorate(ServerStore, {
  x_pos: observable,
  y_pos: observable,
  connections: observable
});
