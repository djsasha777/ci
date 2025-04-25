import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
} from "react-router-dom";

import App from './components/app/app';

import reportWebVitals from './reportWebVitals';

import "./scss/index.scss";

ReactDOM.render((
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
), document.getElementById(`root`));

reportWebVitals();
