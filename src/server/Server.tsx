import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Store from "../stores/ServerStore";
import Spinner from "../components/Spinner";
import Application from "../three/Application";
import { BFElement } from "../types";
import HUD from "../components/HUD";

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
        <HUD>
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
          <button onClick={e => { 
            e.stopPropagation(); 
            this.stop();
          }}
          > 
            stop server
          </button>
          <div> connected clients: </div>
          {Object.entries(store.gameState).map(([key, value]) => (
            <div key= { key }>
              <div > {key} </div>
              <div> X: {value.x} </div>
              <div> Y: {value.y} </div>
              <div> Z: {value.z} </div>
            </div>
          ))}
        </HUD>
        <div
          ref={this.createApplication}
        />
      </div>
    );
  }
}

export default observer(Server);
