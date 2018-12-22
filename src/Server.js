import React, { Component } from "react";
import PropTypes from "prop-types";

class Server extends Component {
  static propTypes = {
    peer: PropTypes.object.isRequired,
    stop: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { peer } = this.props;

    peer.on("connection", conn => {
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
    const { peer } = this.props;
    return <div> Server with id: {peer.id} </div>;
  }
}

export default Server;
