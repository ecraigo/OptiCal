import * as objectPrototypes from './objectPrototypes.js';
import * as helpers from './helpers.js';

var tasksDesired = [new objectPrototypes.Task('T1', 2, new objectPrototypes.TimeRange(0, 24)),
					new objectPrototypes.Task('T2', 3, new objectPrototypes.TimeRange(0, 24)),
					new objectPrototypes.Task('T3', 1, new objectPrototypes.TimeRange(1, 3))]

var freeTimes = [new objectPrototypes.TimeRange(1, 5),
					new objectPrototypes.TimeRange(7, 12)]

var prelimCalendar = objectPrototypes.CalendarAssignment(tasksDesired, freeTimes)

var epsilon = 0.05

// Maximum number of iterations loops will go through before giving up.
var maxIterations = 1000

function callSolveCSP(today){
	solveCSP(today, tasksDesired, freeTimes);
}


function solveCSP(tasksDesired, freeTimes) {
	var timeVars = {}
	var schedule = new objectPrototypes.CalendarAssignment(tasksDesired, freeTimes)
	var totalNeededTime = 0
	// Initialize free time variables by the half hour.
	for (var i = 0; i < freeTimes.length; i++){
		var currentFreeBlock = freeTimes[i].start
		totalNeededTime += (freeTimes[i].end - freeTimes[i].start) * 2.0
		while (currentFreeBlock < freeTimes[i].end){
			timeVars[currentFreeBlock] = null
			currentFreeBlock = currentFreeBlock + 0.5
		}
	}
	// Initialize with assignment of desired tasks to free time.
	var timesKeys = Object.keys(timeVars)
	// console.log(timeVars, timesKeys.length, timesKeys, "initialization")
	var j = 0
	for (var k = 0; k < tasksDesired.length; k++){
		var currentTask = tasksDesired[k]
		var neededTimeBlocks = currentTask.hours * 2
		while (neededTimeBlocks > 0)
		{
			// If there are still open time blocks, assign next open block to current task.
			if (j < timesKeys.length) 
			{
				timeVars[timesKeys[j]] = currentTask
  				neededTimeBlocks = neededTimeBlocks - 1
  				j = j + 1
  			}
	  		// If there are no more time blocks, meaning a valid assignment is impossible, return.
	  		else 
	  		{	
	  			return;
	  		}
		}
	}
	// Swap constraint violating variable with another with epsilon chance of random swap.
	
	// console.log(timeVars, timesKeys.length, timesKeys, Object.values(timeVars), "beforebeginning")
	var illegalVars = constraintsViolated(timeVars)
	var iterations = 0
	// console.log(timeVars, timesKeys.length, timesKeys, Object.values(timeVars), "beginning")
	// Keep swapping until we run out of violated variables or have gone through max number of iterations.
	while (illegalVars.length > 0 && iterations < maxIterations)
	{
		// Find a random index within illegal variables to be first time block to swap.
		var randomIndex1 = Math.floor(Math.random() * illegalVars.length)
		var randomTimeVar1 = illegalVars[randomIndex1]
		var randomTimeVar2 = null
		var probability = Math.random()
		// With a probability 1 - epsilon we find a second time block within the time frame that our first task needs for swap.
		if (probability > epsilon) 
		{
			var task1TimeRange = timeVars[illegalVars[randomIndex1]].timeRange
			var randomTimeVar2Math = (Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start
			randomTimeVar2 = Math.floor(randomTimeVar2Math * 2)/2
			var iterations2 = 0
			while ((!(randomTimeVar2 in timeVars) || randomTimeVar2 == randomTimeVar1) && iterations2 < 100)
			{
				randomTimeVar2Math = (Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start
				randomTimeVar2 = Math.floor(randomTimeVar2Math * 2)/2
				iterations2 = iterations2 + 1
				// console.log(randomIndex1, randomTimeVar2)
			}
		}
		// With a probability epsilon that we swap with a random free time.
		else 
		{
			randomTimeVar2 = Math.floor(Math.random() * timesKeys.length * 2)/2
			var iterations3 = 0
			while ((!(randomTimeVar2 in timeVars) || randomTimeVar2 == randomTimeVar1) && iterations3 < 100)
			{
				randomTimeVar2 = Math.floor(Math.random() * timesKeys.length * 2)/2
				iterations3 = iterations3 + 1
			}
		}
		// console.log(timeVars, iterations)
		// console.log(illegalVars[randomIndex1], randomTimeVar2, illegalVars)
		// console.log(timeVars, "before", illegalVars[randomIndex1], randomTimeVar2)
		helpers.swapTimes(timeVars, illegalVars[randomIndex1], randomTimeVar2.toString())
		// console.log(timeVars, "after")
		illegalVars = constraintsViolated(timeVars)
		iterations = iterations + 1
	}
	// console.log(timeVars)
	if (iterations == 1000) 
	{
		return;
	}
	else
	{
		schedule.halfHours = convertFormat(timeVars)
		return schedule
	}
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
//   		var randomTimeVar2 = null
//   		if (probability > epsilon) {
//   			var task1TimeRange = timeVars[illegalVars[randomIndex1]].timeRange
//   			randomTimeVar2 = Math.floor(((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start) * 2)/2
//   			console.log(randomTimeVar2, "iter")
//   			var maxIter = 0
//   			while (randomTimeVar2 == randomIndex1 && maxIter < 100){
//   				randomTimeVar2 = Math.floor(((Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start) * 2)/2
//   				maxIter = maxIter + 1
//   				console.log(randomIndex1, randomTimeVar2)
//   			}
//   		}
//   		else {
//   			randomTimeVar2 = Math.floor(Math.random() * illegalVars.length * 2)/2
//   			var maxIters = 0
//   			while (randomTimeVar2 == randomIndex1 && maxIters < 100){
//   				randomTimeVar2 = Math.floor(Math.random() * illegalVars.length * 2)/2
//   				maxIters = maxIters + 1
//   			}
//   		}
//   		console.log(randomIndex1, randomTimeVar2, illegalVars)
//   		console.log(illegalVars[randomIndex1], randomTimeVar2, illegalVars)
//   		helpers.swapTimes(timeVars, illegalVars[randomIndex1], randomTimeVar2)
//   		illegalVars = constraintsViolated(timeVars)
//   		iterations = iterations + 1
//   	}
//   	console.log(timeVars)
//   	var schedule = new objectPrototypes.CalendarAssignment(tasksDesired, freeTimes)
//   	schedule.halfHours = timeVars
//   	return schedule
// });
// }

function convertFormat(assignments)
{
	for (var time in assignments)
	{
		if (assignments[time] != undefined)
		{
			assignments[time] = assignments[time].name
		}
	}
	return assignments
}


// Helper function to check for constraints and if there are, return them as a list.
function constraintsViolated(assignments)
{
	var violated = []
	for (var k in assignments){
		var task = assignments[k]
		if (task != null) {
			var allowedTime = task.timeRange
			// console.log(allowedTime, k)
			if (k < allowedTime.start || k > allowedTime.end)
			{
				violated.push(k)
			}
		}
	}
	// console.log(violated)
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
	callSolveCSP, solveCSP, convertFormat
}
