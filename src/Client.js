import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Spinner from "./Spinner";

class Client extends Component {
  static propTypes = {
    peer: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    serverId: PropTypes.string.isRequired
  };

  state = {
    loading: true,
    error: null
  };

  componentDidMount() {
    const { peer, serverId } = this.props;

    this.conn = peer.connect(serverId);

    this.conn.on("open", () => {
      this.conn.on("data", data => {
        this.setState({ loading: false, error: null });
        console.log("Received from server:", data);
      });

      this.conn.send("Hello from client!");
    });

    // ERROR HANDLING
    peer.on("error", err => {
      if (err.type === "peer-unavailable") {
        this.setState({ loading: false, error: true });
      }
      console.error(err);
    });
  }

  componentWillUnmount() {
    this.props.peer.destroy();
  }

  render() {
    const { peer, serverId } = this.props;
    const { loading, error } = this.state;

    if (loading) {
      return <Spinner />;
    }
    if (error) {
      return (
        <div>
          Could not connect to server {serverId}
          <Link to="/">
            <button>Back to home</button>
          </Link>
        </div>
      );
    }

    return (
      <div>
        <div> Connected to server with id: {serverId} </div>
        <div> Own ID: {peer.id} </div>
      </div>
    );
  }
}

export default Client;
