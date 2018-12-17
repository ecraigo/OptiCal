import React, { Component } from 'react';
import logo from './logo.svg';
import * as gcalLoad from './gcalLoad.js';
import './App.css';

// Needed for testing
import {runTests} from './tests.js';

class App extends Component {
  loadGoogleCalendarApi() {
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
        <p>Task Names:</p>
        <input id="task_names" required/>
        <p>Task Required Hours:</p>
        <input id="task_req_hours" required/>  
        <p>Task Required Time Ranges:</p>
        <input id="task_time_ranges" required/>        
        <p>Free Times:</p>
        <input id="freetimes"/>
        <p> </p>
        <input id ="submit_button" type="submit" value="Submit" />

        <p id = "results"></p>
      </div>
    );
  }

  componentDidMount() {
    // Run tests! Take this out if you don't want to run tests.
    // runTests();
    this.loadGoogleCalendarApi();
  }
}

export default App;