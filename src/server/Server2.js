import React, { Component } from "react";
import { observer } from "mobx-react";

import Store from "../Store";

const store = new Store();

class Server2 extends Component {
  componentWillUnmount() {
    // const { peer } = this.props;
    store.peer.destroy();
  }

  render() {
    return (
      <div>
        <div>Server with id: {store.id}</div>
        <div> connected clients: </div>
        {store.connections.map(client => (
          <div key={client.peer}> {client.peer} </div>
        ))}
      </div>
    );
  }
}

export default observer(Server2);
