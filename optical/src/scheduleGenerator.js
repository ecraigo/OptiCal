import * as gcalLoad from './gcalLoad.js';

var submitButton = undefined;
var sourceDocument = undefined;
var desiredEvents = undefined;
var desiredEventsTimes = undefined;

function setupSchedules(sourceDoc) {
	sourceDocument = sourceDoc;
	submitButton = sourceDocument.getElementById('authorize_button');
	desiredEvents = sourceDocument.getElementById('events');
	desiredEventsTimes = sourceDocument.getElementById('times');
	// (sourceDocument.getElementById('schedules')).appendChild(sourceDocument.createTextNode("hi" + '\n'));
	submitButton.onClick = iterativeMinConflicts(desiredEvents, desiredEventsTimes)
	// iterativeMinConflicts(desiredEvents, desiredEventsTimes, )
}

function iterativeMinConflicts(desiredEvents, desiredEventsTimes) {
	console.log(desiredEvents.value)
}

export {
	iterativeMinConflicts, setupSchedules
}