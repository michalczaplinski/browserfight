import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import Spinner from "../components/Spinner";
import Store from "./Store";

type Props = {
  serverId: string
}

class Client extends Component<Props, {}> {
  static propTypes = {
    serverId: PropTypes.string.isRequired
  };

  interval: any;
  store = new Store({ serverId: this.props.serverId });

  componentDidMount() {
    this.interval = window.setInterval(
      () => this.store.send({ x_pos: 0, y_pos: 0 }),
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
        <div> Connected to server with id: <span id="server-id">{serverId}</span> </div>
        <div> Own ID: <span id="client-id">{this.store.peer.id}</span> </div>
      </div>
    );
  }
}

export default observer(Client);
