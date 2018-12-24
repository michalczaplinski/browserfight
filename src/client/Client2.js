import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import Spinner from "../components/Spinner";
import Store from "./Store";

class Client extends Component {
  static propTypes = {
    serverId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.store = new Store({ serverId: this.props.serverId });
  }

  componentDidMount() {
    this.interval = setInterval(
      () => this.store.send({ id: this.store.peer.id, data: "blabla" }),
      1000
    );
  }

  componentWillUnmount() {
    this.store.peer.destroy();
    clearInterval(this.interval);
  }

  render() {
    const { serverId } = this.props;

    if (this.store.loading) {
      return <Spinner />;
    }

    if (this.store.error) {
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
        <div> Own ID: {this.store.peer.id} </div>
        <canvas id="canvas" />
      </div>
    );
  }
}

export default observer(Client);
