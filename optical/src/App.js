/*
Google Calendar API components of code is under:
Copyright 2018 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react';
// import logo from './logo.svg';
import * as gcalLoad from './gcalLoad.js';
import './App.css';

// Needed for testing
// import {runTests} from './tests.js';

class App extends Component {
  loadGoogleCalendarApi() {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";

      script.onload = () => {
        // console.log(window.gapi);
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
        <p>Task Allowed Time Ranges:</p>
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
