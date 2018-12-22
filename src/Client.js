import React, { Component } from "react";
import PropTypes from "prop-types";

class Client extends Component {
  static propTypes = {
    peer: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    serverId: PropTypes.string.isRequired
  };

  componentDidMount() {
    const { peer, serverId } = this.props;

    this.conn = peer.connect(serverId);

    this.conn.on("open", () => {
      this.conn.on("data", data => {
        console.log("Received from server:", data);
      });

      this.conn.send("Hello from client!");
    });

    // ERROR HANDLING
    this.conn.on("error", err => {
      console.error(err);
    });

    peer.on("error", err => {
      console.error(err);
    });
  }

  componentWillUnmount() {
    this.props.peer.destroy();
  }

  render() {
    const { peer, serverId } = this.props;
    return (
      <div>
        <div> Connected to server with id: {serverId} </div>
        <div> Own ID: {peer.id} </div>
      </div>
    );
  }
}

export default Client;
