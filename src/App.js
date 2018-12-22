import React, { Component } from "react";
import Peer from "peerjs";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Server from "./Server";
import Client from "./Client";

const Home = ({ start }) => <button onClick={() => start()}> start </button>;

class App extends Component {
  state = {
    started: false
  };

  componentDidMount() {
    this.peer = new Peer();

    this.peer.on("open", id => {
      console.log("open with ID:", id);
      this.setState({ id });
    });
  }

  start = () => {
    this.setState({ started: true });
  };

  stop = () => {
    this.setState({ started: false });
  };

  render() {
    const { started, id } = this.state;

    return (
      <div>
        <h1>Browserfight</h1>
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                // TODO: this depends on the assumption that the Peer & id are available already on the App
                if (started) return <Redirect to={`/${id}`} />;
                return <Home start={this.start} />;
              }}
            />
            <Route
              exact
              path="/:id"
              render={({ match }) => {
                if (!id) {
                  return <div> waiting ... </div>;
                }
                if (started) {
                  return <Server id={id} stop={this.stop} peer={this.peer} />;
                }
                return (
                  <Client id={id} serverId={match.params.id} peer={this.peer} />
                );
              }}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
