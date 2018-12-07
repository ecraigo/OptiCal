import * as objectPrototypes from './objectPrototypes.js';

var tasksDesired = [new objectPrototypes.Task('T1', 2),
					new objectPrototypes.Task('T2', 3), 
					new objectPrototypes.Task('T3', 1, new objectPrototypes.TimeRange(1, 3))]

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
  	// Initialize with assignment of desired tasks.
  	var timesKeys = Object.keys(timeVars)
  	var j = 0
  	for (var i = 0; i < tasksDesired.length; i++){
  		var currentTask = tasksDesired[i]
  		var neededTimeBlocks = currentTask.hours * 2
  		while (neededTimeBlocks > 0){
  			if (j < timesKeys.length) {
  				timeVars[timesKeys[j]] = currentTask.name
	  			neededTimeBlocks = neededTimeBlocks - 1 
	  			j = j + 1
	  		}
  		}
  	}
  	var illegalVars = []
  	while (constraintsViolated(timeVars, illegalVars) > 0){
  		var randomIndex1 = Math.random() * illegalVars.length
  		var probability = Math.random()
  		var randomIndex2 = null
  		if (probability > epsilon) {
  			randomIndex2 = Math.random() * illegalVars.length
  			while (randomIndex2 == randomIndex1){
  				randomIndex2 = Math.random() * illegalVars.length
  			}
  		}
  		else {
  			randomIndex2 = Math.random() * illegalVars.length
  			while (randomIndex2 == randomIndex1){
  				randomIndex2 = Math.random() * illegalVars.length
  			}
  		}
  	}
});
}

function constraintsViolated(){
	console.log("hello")
	return true
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