 
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './app/assets/scss/predefined.scss';
import './app/assets/scss/style.scss';
// import './app/assets/slider.min.css';
// import './app/assets/slider.min.js';
import { BrowserRouter as Router } from 'react-router-dom';
import {Provider} from 'react-redux'
import {store} from '../src/redux/store.js'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router basename='/'>
    <Provider  store={store}>
    <App />
   </Provider>

    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
 