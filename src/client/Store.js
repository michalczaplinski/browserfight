import Peer from "peerjs";
import { observable, decorate } from "mobx";

class ClientStore {
  data;

  connection;
  error;

  constructor({ serverId }) {
    const peer = new Peer();

    this.connection = peer.connect(serverId);

    this.connection.on("open", () => {
      this.connection.on("data", data => {
        this.data = data;
        console.log("Received from server:", data);
      });

      this.connection.send("Hello from client!");

      this.interval = setInterval(
        () => this.connection.send({ id: peer.id, data: "blabla" }),
        1000
      );
    });

    // ERROR HANDLING
    peer.on("error", err => {
      if (err.type === "peer-unavailable") {
        this.setState({ loading: false, error: true });
      }
      console.error(err);
    });
  }

  send(data) {
    this.connection.send(data);
  }
}

export default decorate(ClientStore, {
  data: observable
});
