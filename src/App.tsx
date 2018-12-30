import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Server from "./server/Server";
import Client from "./client/Client";

const Home = ({ start } : { start: () => void }) => (
  <div>
    <button id="start-game" onClick={() => start()}> start </button>
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
