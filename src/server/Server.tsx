import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Store from "../stores/ServerStore";
import Spinner from "../components/Spinner";
import Application from "../three/Application";
import { BFElement } from "../types";

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

  createApplication = (element: HTMLDivElement & BFElement) => {
    let app = new Application(element, this.store);
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
          <div key= { key }>
            <div > {key} </div>
            <div> X: {value.x} </div>
            <div> Y: {value.y} </div>
            <div> Z: {value.z} </div>
          </div>
        ))}
        <div
          ref={this.createApplication}
          style={{
            width: "100vw",
            height: "100vh",
            zIndex: 100
          }}
        />
      </div>
    );
  }
}

export default observer(Server);
