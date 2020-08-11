// ©Arthurdw - MIT //
import React from "react";
import socketIOClient from "socket.io-client";

import "../scss/home-page.scss";

const ENDPOINT = "http://127.0.0.1:6750";

class HomePage extends React.Component<{}, any> {
  pre_wrapper = "User/Console> ";
  socket = socketIOClient(ENDPOINT);
  interval: number;
  constructor(props: object) {
    super(props);
    this.interval = 0;
    this.state = {
      connected: false,
      keys: [],
      command: "",
      data: [],
    };
    this.handleSocketStatus();
  }

  handleSocketStatus() {
    this.socket.on("connect", () => {
      this.setState({ connected: true });
      this.socket.on("disconnect", () => {
        this.setState({ connected: false });
      });
    });
  }

  handleSocket(message: string) {
    this.socket.emit("command", { cmd: message, data: this.state.data });
    this.socket.on("command-receive", (received: Array<String>) => {
      this.setState({ data: received });
    });
    return () => this.socket.disconnect();
  }

  getNumberArray(arr: Array<number>) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (typeof arr[i] == "number") {
        newArr[newArr.length] = arr[i];
      }
    }
    return newArr;
  }

  render() {
    return (
      <React.Fragment>
        <div className="console-wrapper">
          <div className="console">
            <div className="header">
              <div className="application-name-wrapper">
                <div className="application-name">
                  {this.state.connected && (
                    <p>Personal console running on {this.socket.id}</p>
                  )}
                  {!this.state.connected && (
                    <p>
                      Oops, couldn't connect to servers... Contact support at{" "}
                      <a href="http://dc.xiler.net" target="_blanc">
                        dc.xiler.net
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <div className="menu-wrapper">
                <div className="menu">
                  <div className="minimize"></div>
                  <div className="size-switch"></div>
                  <div className="close"></div>
                </div>
              </div>
            </div>
            <div className="ui">
              <div className="inp">
                <span key={0} className="pre">
                  {this.pre_wrapper}
                </span>
                <textarea
                  rows={1}
                  id="data"
                  className="data"
                  value={this.state.command}
                  onChange={(event) => {
                    this.setState({ command: event.target.value });
                  }}
                  onKeyDown={(event) => {
                    const el = document.querySelector(
                      "#data"
                    )! as HTMLTextAreaElement;
                    setTimeout(function () {
                      el.style.cssText = "height:auto; padding:0";
                      el.style.cssText = "height:" + el.scrollHeight + "px";
                    }, 0);
                    const keys = this.state.keys;
                    keys[event.keyCode] = event.keyCode;
                    this.setState({ keys: keys });
                    if (
                      this.getNumberArray(this.state.keys).toString() === "13"
                    ) {
                      event.preventDefault();
                      if (this.state.command.trim() === "") {
                        return;
                      }
                      const command = this.state.command.trim();
                      this.setState({
                        data: [
                          { data: command, console: true },
                          ...this.state.data,
                        ],
                        command: "",
                      });
                      this.handleSocket(command);
                    }
                  }}
                  onKeyUp={(event) => {
                    const keys = this.state.keys;
                    keys[event.keyCode] = false;
                    this.setState({ keys: keys });
                  }}
                ></textarea>
              </div>
              {this.state.data.map(
                (item: { data: string; console: boolean }, index: number) => (
                  <p key={index}>
                    {item.console && (
                      <span className="pre">{this.pre_wrapper}</span>
                    )}
                    {item.data}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
