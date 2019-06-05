import React from "react";
import "./App.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentColor: "red",
      colors: []
    };
  }

  componentDidMount() {
    const socket = new WebSocket("ws://172.46.1.117:8081");

    socket.onopen = () => {
      console.log("Connected to server");
    };

    socket.onmessage = this._handleMessage;

    this.socket = socket;
  }

  render() {
    return (
      <div className="App">
        <h1 style={{ color: this.state.currentColor }}>This is my header!</h1>
        <div className="button-list">{this._renderButtons()}</div>
      </div>
    );
  }

  _renderButtons = () => {
    return this.state.colors.map(c => (
      <button key={c} style={{ borderColor: c }} onClick={this._changeColor(c)}>
        {c}
      </button>
    ));
  };

  _handleMessage = event => {
    console.log("Got a message", event.data);
    const json = JSON.parse(event.data);

    switch (json.type) {
      case "initialMessage":
        this.setState({
          currentColor: json.currentColor,
          colors: json.possibleColors
        });

        break;
      case "colorChanged":
        this.setState({ currentColor: json.color });
        break;
      default:
    }
  };

  _changeColor = newColor => event => {
    const message = {
      type: "newColor",
      newColor
    };
    this.socket.send(JSON.stringify(message));
  };
}

export default App;
