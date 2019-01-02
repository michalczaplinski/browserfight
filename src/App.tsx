import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Server from "./server/Server";
import Client from "./client/Client";
import addPointerLock from "./utils/pointerLock";
import Home from './components/Home';

class App extends Component {
  state = {
    serverStarted: false
  };

  start = () => {
    this.setState({ serverStarted: true });
    addPointerLock()
  };

  stop = () => {
    this.setState({ serverStarted: false });
  };

  render() {
    const { serverStarted } = this.state;

    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              if (serverStarted) {
                return <Server stop={this.stop} />;
              }
              return <Home start={this.start} />;
            }}
          />
          <Route
            exact
            path="/:id"
            render={({ match }) => <Client serverId={match.params.id} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
