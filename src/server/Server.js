import React, { Component } from "react";
import { observer } from "mobx-react";

import Store from "./Store";

const store = new Store();

class Server extends Component {
  componentWillUnmount() {
    store.peer.destroy();
  }

  render() {
    return (
      <div>
        <div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${window.location.origin}/${store.id}`}
          >
            {`${window.location.origin}/${store.id}`}
          </a>
        </div>
        <div> connected clients: </div>
        {Object.values(store.connections).map(client => (
          <div key={client.peer}> {client.peer} </div>
        ))}
      </div>
    );
  }
}

export default observer(Server);
