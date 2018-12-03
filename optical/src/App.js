import React, { Component } from 'react';
import logo from './logo.svg';
import * as gcalLoad from './gcalLoad.js';
import './App.css';

class App extends Component {
  loadGoogleCalendarApi() {
      console.log('hello');
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";

      script.onload = () => {
        console.log(window.gapi);
        gcalLoad.handleClientLoad(document, window.gapi);
      }
      document.body.appendChild(script);
    }

  render() {
    console.log('client id:', gcalLoad.getClientId());
    console.log('api key', gcalLoad.getApiKey());
    return (
      <div className="App">
        <p>Google Calendar API Quickstart</p>

        <button id="authorize_button">Authorize</button>
        <button id="signout_button">Sign Out</button>

        <pre id="content"></pre>
      </div>
    );
  }

  componentDidMount() {
    this.loadGoogleCalendarApi();
  }
}

export default App;
