import Peer from "peerjs";
import { observable, decorate } from "mobx";

class ClientStore {
  data;
  error;
  loading = true;

  connection;
  peer;

  constructor({ serverId }) {
    this.peer = new Peer();

    this.connection = this.peer.connect(serverId);

    this.connection.on("open", () => {
      this.loading = false;

      this.connection.send("Hello from client!");

      this.connection.on("data", data => {
        this.data = data;
        console.log("Received from server:", data);
      });

      this.connection.on("error", err => {
        this.error = err;
        console.log(err);
      });

      this.connection.on("close", () => {
        this.error = "The connection was closed";
      });
    });

    // ERROR HANDLING
    this.peer.on("error", err => {
      if (err.type === "peer-unavailable") {
        this.error = err;
      }
      console.error(err);
    });
  }

  send(data) {
    this.connection.send(data);
  }
}

export default decorate(ClientStore, {
  data: observable,
  error: observable,
  loading: observable
});
