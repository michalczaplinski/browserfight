import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import Spinner from "../components/Spinner";
import Store from "../stores/ClientStore";

import { Application as ClientApplication } from '../three/Application';
import { BFElement } from "../types";
import HUD from "../components/HUD";

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

  createApplication = (element: HTMLDivElement & BFElement) => {
    let app = new ClientApplication(element, this.store);
  }

  render() {
    const { serverId } = this.props;
    const { store } = this;

    if (store.loading) {
      return <Spinner />;
    }

    if (store.error) {
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
        <HUD>
          <div> Connected to server with id: 
            <span id="server-id">{serverId}</span> 
          </div>
          <div> Own ID: 
            <span id="client-id">{store.id}</span>
            {Object.entries(store.gameState).map(([key, value]) => (
              <div key={key}>
                <div > {key} </div>
                <div> <b>health:</b> {value.health}</div>
                <br/>
              </div>
            ))}
          </div>
        </HUD>
        <div ref={this.createApplication}/>
      </div>
    );
  }
}

export default observer(Client);
