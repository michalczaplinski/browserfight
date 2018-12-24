import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Server from "./server/Server";
import Client from "./client/Client2";

const Home = ({ start }) => (
  <div>
    <button onClick={() => start()}> start </button>
  </div>
);

class App extends Component {
  state = {
    serverStarted: false
  };

  start = () => {
    this.setState({ serverStarted: true });
  };

  stop = () => {
    this.setState({ serverStarted: false });
  };

  render() {
    const { serverStarted } = this.state;

    return (
      <div>
        <h1>Browserfight</h1>
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
      </div>
    );
  }
}

export default App;
