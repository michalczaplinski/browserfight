import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import  Store from "./Store";
import Spinner from "../components/Spinner";

type Props = {
  stop: () => void
}

class Server extends Component<Props, {}> {
  static propTypes = {
    stop: PropTypes.func.isRequired
  };

  store: Store = new Store();

  componentWillUnmount() {
    this.store.peer.destroy();
  }

  stop() {
    this.store.peer.destroy();
    this.props.stop();
  }

  render() {
    const { store } = this;
    if (!this.store.id) {
      return <Spinner />;
    }
    return (
      <div>
        <div>
          <a
            id="client-url"
            target="_blank"
            rel="noopener noreferrer"
            href={`${window.location.origin}/${store.id}`}
          >
            {`${window.location.origin}/${store.id}`}
          </a>
        </div>
        <span hidden id="client-id">{store.id}</span>
        <button onClick={() => this.stop()}> stop server </button>
        <div> connected clients: </div>
        {Object.entries(store.gameState).map(([key, value]) => (
          <div>
            <div key={key}> {key} </div>
            <div> X: {value.x_pos} </div>
            <div> Y: {value.y_pos} </div>
          </div>
        ))}
      </div>
    );
  }
}

export default observer(Server);
