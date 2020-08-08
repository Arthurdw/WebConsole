// ©Arthurdw - MIT //
import React from "react";

import "../scss/home-page.scss";

class HomePage extends React.Component<{}, any> {
  pre_wrapper = "User/Console> ";
  constructor(props: object) {
    super(props);
    this.state = {
      keys: [],
      command: "",
      data: [],
    };
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
              {/* <div className="application-name-wrapper">
                <div className="application-name">
                  <p>Hello World!</p>
                </div>
              </div> */}
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
                        data: [command, ...this.state.data],
                        command: "",
                      });
                      if (command === "cls" || command === "clear") {
                        this.setState({ data: [command] });
                      }
                    }
                  }}
                  onKeyUp={(event) => {
                    const keys = this.state.keys;
                    keys[event.keyCode] = false;
                    this.setState({ keys: keys });
                  }}
                ></textarea>
              </div>
              {this.state.data.map((item: string, index: number) => (
                <p key={index}>
                  <span className="pre">{this.pre_wrapper}</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
