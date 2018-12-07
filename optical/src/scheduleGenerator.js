import * as objectPrototypes from './objectPrototypes.js';
import * as helpers from './helpers.js';

var tasksDesired = [new objectPrototypes.Task('T1', 2, new objectPrototypes.TimeRange(0, 24)),
					new objectPrototypes.Task('T2', 3, new objectPrototypes.TimeRange(0, 24)), 
					new objectPrototypes.Task('T3', 1, new objectPrototypes.TimeRange(1, 2))]

var freeTimes = [new objectPrototypes.TimeRange(1, 5),
					new objectPrototypes.TimeRange(7, 12)]	

var prelimCalendar = objectPrototypes.CalendarAssignment(tasksDesired, freeTimes)		

var epsilon = 0.05

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
  	// Initialize free time variables by the half hour.
  	for (var i = 0; i < freeTimes.length; i++){
  		var currentFreeBlock = freeTimes[i].start
 		while (currentFreeBlock < freeTimes[i].end){
 			timeVars[currentFreeBlock] = null
  			currentFreeBlock = currentFreeBlock + 0.5
 		}
  	}
  	// Initialize with assignment of desired tasks and remaining time with free time.
  	var timesKeys = Object.keys(timeVars)
  	var j = 0
  	for (var k = 0; k < tasksDesired.length; k++){
  		var currentTask = tasksDesired[k]
  		var neededTimeBlocks = currentTask.hours * 2
  		while (neededTimeBlocks > 0){
  			if (j < timesKeys.length) {
  				timeVars[timesKeys[j]] = currentTask
	  			neededTimeBlocks = neededTimeBlocks - 1 
	  			j = j + 1
	  		}
  		}
  	}
  	// Swap constraint violating variable with another with epsilon chance of random swap.
  	console.log(timeVars)
  	var illegalVars = constraintsViolated(timeVars)
  	while (illegalVars.length > 0){
  		var randomIndex1 = Math.floor(Math.random() * illegalVars.length)
  		var probability = Math.random()
  		var randomIndex2 = null
  		if (probability > epsilon) {
  			var task1TimeRange = timeVars[illegalVars[randomIndex1]].timeRange
  			randomIndex2 = Math.floor((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start)
  			while (randomIndex2 == randomIndex1){
  				randomIndex2 = Math.floor((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start)
  			}
  		}
  		else {
  			randomIndex2 = Math.floor(Math.random() * illegalVars.length)
  			while (randomIndex2 == randomIndex1){
  				randomIndex2 = Math.floor(Math.random() * illegalVars.length)
  			}
  		}
  		console.log(randomIndex1, randomIndex2)
  		helpers.swapTimes(timeVars, randomIndex1, randomIndex2)
  		illegalVars = constraintsViolated(timeVars)
  	}
  	console.log(timeVars)
});
}

function constraintsViolated(assignments){
	var violated = []
	for (var k in assignments){
		var task = assignments[k]
		if (task != null) {
			var allowedTime = task.timeRange
			console.log(allowedTime, k)
			if (k < allowedTime.start || k > allowedTime.end){
				violated.push(k)
			}
		}
	}
	console.log(violated)
	return violated
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

export {
	solveCSP
}