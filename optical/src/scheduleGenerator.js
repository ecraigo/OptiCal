import * as objectPrototypes from './objectPrototypes.js';
import * as helpers from './helpers.js';

var tasksDesired = [new objectPrototypes.Task('T1', 2, new objectPrototypes.TimeRange(0, 24)),
					new objectPrototypes.Task('T2', 3, new objectPrototypes.TimeRange(0, 24)),
					new objectPrototypes.Task('T3', 1, new objectPrototypes.TimeRange(1, 3))]

var freeTimes = [new objectPrototypes.TimeRange(1, 5),
					new objectPrototypes.TimeRange(7, 12)]

var prelimCalendar = objectPrototypes.CalendarAssignment(tasksDesired, freeTimes)

var epsilon = 0.05

function callSolveCSP(today){
	solveCSP(today, tasksDesired, freeTimes);
}


<<<<<<< HEAD
function solveCSP(tasksDesired, freeTimes) {
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
=======
function solveCSP(today, tasksDesired, freeTimes) {
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
	  		else {
	  			break
	  		}
  		}
  	}
  	// Swap constraint violating variable with another with epsilon chance of random swap.
  	console.log(timeVars)
  	var illegalVars = constraintsViolated(timeVars)
  	var iterations = 0
  	while (illegalVars.length > 0 && iterations < 100){
  		var randomIndex1 = Math.floor(Math.random() * illegalVars.length)
  		console.log(randomIndex1, "hello")
  		var probability = Math.random()
  		var randomTimeVar = null
  		if (probability > epsilon) {
  			var task1TimeRange = timeVars[illegalVars[randomIndex1]].timeRange
  			randomTimeVar = Math.floor(((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start) * 2)/2
  			console.log(randomTimeVar, "iter")
  			var maxIter = 0
  			while (randomTimeVar == randomIndex1 && maxIter < 100){
  				randomTimeVar = Math.floor(((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start) * 2)/2
  				maxIter = maxIter + 1
  				console.log(randomIndex1, randomTimeVar)
  			}
  		}
  		else {
  			randomTimeVar = Math.floor(Math.random() * illegalVars.length * 2)/2
  			var maxIters = 0
  			while (randomTimeVar == randomIndex1 && maxIters < 100){
  				randomTimeVar = Math.floor(Math.random() * illegalVars.length * 2)/2
  				maxIters = maxIters + 1
  			}
>>>>>>> 3d8d2232d52da330572ab2808e1da32b47210b12
  		}
		}
	}
	// Swap constraint violating variable with another with epsilon chance of random swap.
	console.log(timeVars)
	var illegalVars = constraintsViolated(timeVars)
	var iterations = 0
	while (illegalVars.length > 0 && iterations < 100){
		var randomIndex1 = Math.floor(Math.random() * illegalVars.length)
		console.log(randomIndex1, "hello")
		var probability = Math.random()
		var randomTimeVar = null
		if (probability > epsilon) {
			var task1TimeRange = timeVars[illegalVars[randomIndex1]].timeRange
			randomTimeVar = Math.floor(((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start) * 2)/2
			console.log(randomTimeVar, "iter")
			var maxIter = 0
			while (randomTimeVar == randomIndex1 && maxIter < 100){
				randomTimeVar = Math.floor(((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start) * 2)/2
				maxIter = maxIter + 1
				console.log(randomIndex1, randomTimeVar)
			}
		}
		else {
			randomTimeVar = Math.floor(Math.random() * illegalVars.length * 2)/2
			var maxIters = 0
			while (randomTimeVar == randomIndex1 && maxIters < 100){
				randomTimeVar = Math.floor(Math.random() * illegalVars.length * 2)/2
				maxIters = maxIters + 1
			}
		}
		console.log(randomIndex1, randomTimeVar, illegalVars)
		console.log(illegalVars[randomIndex1], randomTimeVar, illegalVars)
		helpers.swapTimes(timeVars, illegalVars[randomIndex1], randomTimeVar)
		illegalVars = constraintsViolated(timeVars)
		iterations = iterations + 1
	}
	console.log(timeVars)
	var schedule = new objectPrototypes.CalendarAssignment(tasksDesired, freeTimes)
	schedule.halfHours = timeVars
	return schedule
}

// function solveCSP(today, tasksDesired, freeTimes) {
//   window.gapi.client.calendar.events.list({
//     'calendarId': 'primary',
//     'timeMin': today.toISOString(),
//     'timeMax': (new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
//     'showDeleted': false,
//     'singleEvents': true,
//     'orderBy': 'startTime'
//   }).then(function(response) {
//   	var timeVars = {}
//   	// Initialize free time variables by the half hour.
//   	for (var i = 0; i < freeTimes.length; i++){
//   		var currentFreeBlock = freeTimes[i].start
//  		while (currentFreeBlock < freeTimes[i].end){
//  			timeVars[currentFreeBlock] = null
//   			currentFreeBlock = currentFreeBlock + 0.5
//  		}
//   	}
//   	// Initialize with assignment of desired tasks and remaining time with free time.
//   	var timesKeys = Object.keys(timeVars)
//   	var j = 0
//   	for (var k = 0; k < tasksDesired.length; k++){
//   		var currentTask = tasksDesired[k]
//   		var neededTimeBlocks = currentTask.hours * 2
//   		while (neededTimeBlocks > 0){
//   			if (j < timesKeys.length) {
//   				timeVars[timesKeys[j]] = currentTask
// 	  			neededTimeBlocks = neededTimeBlocks - 1
// 	  			j = j + 1
// 	  		}
//   		}
//   	}
//   	// Swap constraint violating variable with another with epsilon chance of random swap.
//   	console.log(timeVars)
//   	var illegalVars = constraintsViolated(timeVars)
//   	var iterations = 0
//   	while (illegalVars.length > 0 && iterations < 100){
//   		var randomIndex1 = Math.floor(Math.random() * illegalVars.length)
//   		console.log(randomIndex1, "hello")
//   		var probability = Math.random()
//   		var randomTimeVar = null
//   		if (probability > epsilon) {
//   			var task1TimeRange = timeVars[illegalVars[randomIndex1]].timeRange
//   			randomTimeVar = Math.floor(((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start) * 2)/2
//   			console.log(randomTimeVar, "iter")
//   			var maxIter = 0
//   			while (randomTimeVar == randomIndex1 && maxIter < 100){
//   				randomTimeVar = Math.floor(((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start) * 2)/2
//   				maxIter = maxIter + 1
//   				console.log(randomIndex1, randomTimeVar)
//   			}
//   		}
//   		else {
//   			randomTimeVar = Math.floor(Math.random() * illegalVars.length * 2)/2
//   			var maxIters = 0
//   			while (randomTimeVar == randomIndex1 && maxIters < 100){
//   				randomTimeVar = Math.floor(Math.random() * illegalVars.length * 2)/2
//   				maxIters = maxIters + 1
//   			}
//   		}
//   		console.log(randomIndex1, randomTimeVar, illegalVars)
//   		console.log(illegalVars[randomIndex1], randomTimeVar, illegalVars)
//   		helpers.swapTimes(timeVars, illegalVars[randomIndex1], randomTimeVar)
//   		illegalVars = constraintsViolated(timeVars)
//   		iterations = iterations + 1
//   	}
//   	console.log(timeVars)
//   	var schedule = new objectPrototypes.CalendarAssignment(tasksDesired, freeTimes)
//   	schedule.halfHours = timeVars
//   	return schedule
// });
// }


// Helper function to check for constraints and if there are, return them as a list.
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

// For next time.
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
	callSolveCSP, solveCSP
}
