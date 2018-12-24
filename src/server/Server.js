import React, { Component } from "react";
import PropTypes from "prop-types";

class Server extends Component {
  static propTypes = {
    id: PropTypes.string,
    peer: PropTypes.object.isRequired,
    stop: PropTypes.func.isRequired
  };

  state = {
    connectedClients: []
  };

  componentDidMount() {
    const { peer } = this.props;

    peer.on("connection", conn => {
      this.setState(state => ({
        connectedClients: [conn.peer, state.connectedClients]
      }));

      conn.on("open", () => {
        conn.send("Hello from server");
      });

      conn.on("data", data => {
        console.log("data from client", data);
      });

      // ERROR HANDLING
      conn.on("error", err => {
        console.log(err);
      });
    });
  }

  componentWillUnmount() {
    const { stop, peer } = this.props;
    stop();
    peer.destroy();
  }

  render() {
    const { id } = this.props;
    const { connectedClients } = this.state;
    return (
      <div>
        <div>Server with id: {id}</div>
        <div> connected clients: </div>
        {connectedClients.map(client => (
          <div key={client}> {client} </div>
        ))}
      </div>
    );
  }
}

export default Server;
