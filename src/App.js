import React, { Component } from "react";
import Peer from "peerjs";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Server from "./Server";
import Client from "./Client";
import Spinner from "./Spinner";

const Home = ({ start }) => (
  <div>
    <button onClick={() => start()}> start </button>
  </div>
);

class App extends Component {
  state = {
    serverStarted: false
  };

  componentDidMount() {
    this.peer = new Peer();

    this.peer.on("open", id => {
      console.log("open with ID:", id);
      this.setState({ id });
    });
  }

  start = () => {
    this.setState({ serverStarted: true });
  };

  stop = () => {
    this.setState({ serverStarted: false });
  };

  render() {
    const { serverStarted, id } = this.state;

    return (
      <div>
        <h1>Browserfight</h1>
        {!id ? (
          <Spinner />
        ) : (
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  if (serverStarted) {
                    return <Server id={id} stop={this.stop} peer={this.peer} />;
                  }
                  return <Home start={this.start} />;
                }}
              />
              <Route
                exact
                path="/:id"
                render={({ match }) => {
                  return (
                    <Client
                      id={id}
                      serverId={match.params.id}
                      peer={this.peer}
                    />
                  );
                }}
              />
            </Switch>
          </Router>
        )}
      </div>
    );
  }
}

export default App;
