import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import web3Context from "./context/web3Context";

import NFTApp from "./nft-app";
import { createContext } from "react";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      provider: null,
      address: null,
    };
  }

  render() {
    return (
      <div className="App">
        <web3Context.Provider value={this.state}>
          <BrowserRouter>
            <NFTApp />
          </BrowserRouter>
        </web3Context.Provider>
      </div>
    );
  }
}

export default App;
