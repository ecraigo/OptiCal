/** Much of this display code is taken from example code on the Google
  * Calendar API website and edited to be runnable in React. Heavily
  * customized functions that implement functionality specific to our
  * project are marked as "CUSTOM CODE" in this file, to keep things
  * straight.
  */

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

import secrets from './secrets.json'
import {TimeRange, Task} from './objectPrototypes.js';
import {solveCSP} from './scheduleGenerator.js';
import {naiveHillClimbing, epsilonGreedyHillClimbing, simulatedAnnealing} from
  './optimizationAlgorithms.js';
import {getBlocks} from './helpers.js';

function getClientId() {
  return secrets["client_id"];
}

function getApiKey() {
  return secrets['api_key'];
}

// google calendar api quickstart
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

// These variables' values will be populated once the API is loaded.
var gapi = undefined;
var sourceDocument = undefined;
var authorizeButton = undefined;
var signoutButton = undefined;
var submitButton = undefined;
var taskNames = undefined;
var taskReqHours = undefined;
var taskTimeRanges = undefined;
var freeTimes = undefined;
var results = undefined;

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad(sourceDoc, api) {
  sourceDocument = sourceDoc;
  gapi = api;
  authorizeButton = sourceDocument.getElementById('authorize_button');
  signoutButton = sourceDocument.getElementById('signout_button');
  submitButton = sourceDocument.getElementById('submit_button')
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: getApiKey(),
    clientId: getClientId(),
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    submitButton.onclick = handleSubmitClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  CUSTOM CODE
 *  Called when user submits CSP inputs to generate schedules and
 optimize with optimization algos.
 */
function handleSubmitClick(event) {
  taskNames = sourceDocument.getElementById('task_names')
  taskReqHours = sourceDocument.getElementById('task_req_hours')
  taskTimeRanges = sourceDocument.getElementById('task_time_ranges')
  freeTimes = sourceDocument.getElementById('freetimes')
  results = sourceDocument.getElementById('results')
  // Process task inputs into correct form for algos.
  var processed
  taskNames = taskNames.value.split(',')
  taskReqHours = taskReqHours.value.split(',')
  taskTimeRanges = taskTimeRanges.value.split(',')
  if (taskNames.length === taskReqHours.length && taskNames.length === taskTimeRanges.length) {
    var tasks = []
    for (var i = 0; i < taskNames.length; i++){
      if (taskTimeRanges[i] === "None") {
        taskTimeRanges[i] = new TimeRange(0, 24)
      }
      else {
        processed = taskTimeRanges[i].split('-')
        taskTimeRanges[i] = new TimeRange(parseFloat(processed[0]), parseFloat(processed[1]))
      }
      var newTask = new Task(taskNames[i], parseFloat(taskReqHours[i]), taskTimeRanges[i])
      tasks.push(newTask)
    }
  }
  else {
    window.alert("Please try again.")
  }
  // Process free time inputs.
  freeTimes = freeTimes.value.split(',')
  for (var j = 0; j < freeTimes.length; j++){
    processed = freeTimes[j].split('-')
    freeTimes[j] = new TimeRange(parseFloat(processed[0]), parseFloat(processed[1]))
  }
  // Run CSP solver on inputted data.
  var schedules = []
  var CSPschedule = solveCSP(tasks, freeTimes)
  schedules.push(CSPschedule)
  // Run optimization algos on CSP generated schedule.
  if (CSPschedule === undefined) {
    window.alert("No valid schedules were found.")
  }
  else {
    schedules.push(naiveHillClimbing(CSPschedule))
    schedules.push(epsilonGreedyHillClimbing(CSPschedule))
    schedules.push(simulatedAnnealing(CSPschedule))
    results.innerHTML = convertFormatToPrint(schedules)
  }
}

/**
 *  CUSTOM CODE
 *  Called to convert list of generated schedules to format that
 is readable and user friendly.
 */
function convertFormatToPrint(lstAssignments) {
  var retString = "Here are four schedules of events you can place in your " +
                  "calendar that fulfill your daily requirements, generated " +
                  "by four different algorithms surveyed in this project. " +
                  "For each event list, the associated algorithm(s) is/are " +
                  "specified.<br /><br /><br />";

  retString += "Schedule 1 – CSP solver alone:<br />";
  retString += convertAssignment(lstAssignments[0]);
  retString += "<br />";

  retString += "Schedule 2 – CSP solver plus naïve hill-climbing:<br />";
  retString += convertAssignment(lstAssignments[1]);
  retString += "<br />";

  retString += "Schedule 3 – CSP solver plus ɛ-greedy hill-climbing:<br />";
  retString += convertAssignment(lstAssignments[2]);
  retString += "<br />";

  retString += "Schedule 4 – CSP solver plus simulated annealing:<br />";
  retString += convertAssignment(lstAssignments[3]);
  retString += "<br /><br />";

  retString += "Thanks and glad to be of service!";
  return retString;
}

/**
 *  CUSTOM CODE
 *  Helper function to convert individual generated schedules to
 format that is readable and user friendly.
 */
function convertAssignment(schedule){
  var retString = "";
  // Get consolidated calendar events from half-hour blocks
  var blocks = getBlocks(schedule.halfHours);

  // Add each calendar event to the printed-out schedule
  blocks.forEach(function(block) {
    var startTime = parseFloat(block.startTime);
    var endTime = parseFloat(startTime + block.length);
    retString += startTime + "-" + endTime + ": " + block.name + "<br />";
  });

  return retString;
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    var today = new Date()
    listUpcomingEvents(today)
    // scheduleGenerator.callSolveCSP(today)
  } else {
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = sourceDocument.getElementById('content');
  var textContent = sourceDocument.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents(today) {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': today.toISOString(),
    'timeMax': (new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    appendPre('Upcoming events:');

    if (events.length > 0) {
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      appendPre('No upcoming events found.');
    }
  });
}

export {
  getClientId, getApiKey,
  handleSubmitClick, handleClientLoad, initClient, updateSigninStatus,
  handleAuthClick, handleSignoutClick, appendPre, listUpcomingEvents
 };
