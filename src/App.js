import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import web3Context from "./context/web3Context";
import ReactGA from 'react-ga';

import NFTApp from "./nft-app";
import { createContext } from "react";

const TRACKING_ID = "UA-105859386-2"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

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
