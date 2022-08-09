import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import ReactGA from 'react-ga';
import NFTApp from "./nft-app";

{/* Google Analytics Tracking ID */}
const TRACKING_ID = "UA-105859386-2"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

export class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <NFTApp />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
