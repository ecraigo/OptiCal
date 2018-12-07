import * as objectPrototypes from './objectPrototypes.js';

var tasksDesired = [new objectPrototypes.Task('T1', 2),
					new objectPrototypes.Task('T2', 3), 
					new objectPrototypes.Task('T3', 1, new objectPrototypes.TimeRange(1, 3))]

var freeTimes = [new objectPrototypes.TimeRange(1, 5),
					new objectPrototypes.TimeRange(7, 12)]	

var prelimCalendar = objectPrototypes.CalendarAssignment(tasksDesired, freeTimes)				

function solveCSP(today) {
  window.gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': today.toISOString(),
    'timeMax': (new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  }).then(function(response) {
  	var timeVars = {}
  	for (var i = 0; i < freeTimes.length; i++){
  		var currentFreeBlock = freeTimes[i].start
 		while (currentFreeBlock < freeTimes[i].end){
 			timeVars.currentFreeBlock = undefined
  			currentFreeBlock = currentFreeBlock + 0.5
 		}
  	}
  	var timesKeys = Object.keys(timeVars)
  	var timesKeysIndex = 0
  	for (var i = 0; i < tasksDesired.length; i++){
  		var currentTask = tasksDesired[i]
  		var neededTimeBlocks = currentTask.timerange
  		while (neededTimeBlocks > 0){
  			if (timesKeysIndex < timesKeys.length) {
  				timesKeys[timesKeysIndex] = currentTask
	  			neededTimeBlocks = neededTimeBlocks - 1 
	  			timesKeysIndex = timesKeysIndex + 1
	  		}
  		}
  	}
  	// var events = response.result.items;
  	// console.log(events)
  	// var variables = {}
  	// var unavailableTime = new Set()
  	// for (var event in events){
  	// 	console.log(events[event].start)
  	// 	var startTime = events[event].start[dateTime];
  	// 	var endTime = events[event].end[dateTime];
  	// 	while (startTime < endTime) {
			// startTime = (new Date(startTime.getTime() + 30 * 60 * 1000))
			// var startHour = startTime.getHours()
			// var startMinute = startTime.getMinutes()
			// if (startMinute/30 < 1){
			// 	startMinute = 0
			// }
			// else {
			// 	startMinute = 0.5
			// }
			// unavailableTime.add(startHour + startMinute)
  	// 	}

  	// }
  });
}

export {
	solveCSP
}