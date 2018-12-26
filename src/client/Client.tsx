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

  store = new Store({ serverId: this.props.serverId });

  componentWillUnmount() {
    this.store.peer.destroy();
  }

  changeX(x: string) {
    const x_pos = parseInt(x);
    const gameState = this.store.gameState[this.store.peer.id];
    this.store.updateState({ x_pos, y_pos: gameState.y_pos })
  }

  changeY(y: string) {
    const y_pos = parseInt(y);
    const gameState = this.store.gameState[this.store.peer.id];
    this.store.updateState({ y_pos, x_pos: gameState.x_pos })
  }

  render() {
    const { serverId } = this.props;
    const { store } = this;

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
        <input 
          type="number" 
          name="X" 
          onChange={e => this.changeX(e.target.value)}
          value={store.gameState[store.id].x_pos} 
        >
        </input>
        <input 
          type="number" 
          name="Y" 
          onChange={e => this.changeY(e.target.value)}
          value={store.gameState[store.id].y_pos} 
        >
        </input>
      </div>
    );
  }
}

export default observer(Client);
