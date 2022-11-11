import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import TagManager from "react-gtm-module";
import NFTApp from "./nft-app";

{/* Google Tag Manager ID */}
const TAG_ID = "G-ET0G4GNEPM";
TagManager.initialize({gtmId: TAG_ID});

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
