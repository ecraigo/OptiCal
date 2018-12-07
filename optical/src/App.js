import React, { Component } from 'react';
import logo from './logo.svg';
import * as gcalLoad from './gcalLoad.js';
import './App.css';

class App extends Component {
  loadGoogleCalendarApi() {
      // console.log('hello');
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";

      script.onload = () => {
        console.log(window.gapi);
        gcalLoad.handleClientLoad(document, window.gapi);
      }
      document.body.appendChild(script);
    }

  render() {
    return (
      <div className="App">
        <p>Optical</p>

        <button id="authorize_button">Authorize</button>
        <button id="signout_button">Sign Out</button>

        <pre id="content"></pre>

        <form>
          <div className="events">
            <label>
             Events:
              <input type="text" id="events" />
            </label>
          </div>
          <div className="times">
            <label>
              Times:
              <input type="text" id="hours" />
            </label>
          </div>
          <input id ="submitButton" type="submit" value="Submit" />
        </form>
        <pre id="schedules"></pre>
      </div>
    );
  }

  componentDidMount() {
    this.loadGoogleCalendarApi();
  }
}

export default App;
