import * as objectPrototypes from './objectPrototypes.js';
import * as helpers from './helpers.js';

// Uncomment for testing.
// var tasksDesired = [new objectPrototypes.Task('T1', 2, new objectPrototypes.TimeRange(0, 24)),
// 					new objectPrototypes.Task('T2', 3, new objectPrototypes.TimeRange(0, 24)),
// 					new objectPrototypes.Task('T3', 1, new objectPrototypes.TimeRange(1, 3))]

// var freeTimes = [new objectPrototypes.TimeRange(1, 5),
// 					new objectPrototypes.TimeRange(7, 12)]

// Probability that we will swap any variable, whether it violates a constraint or not.
var epsilon = 0.05

// Maximum number of iterations loops will go through before giving up.
var maxIterations = 1000

/* Function that solves a CSP given a list of Tasks desired by the user and a list 
of the user's free times in the form of TimeRanges. Outputs a Calendar Assignment 
which includes the CSP's Task constraints, free time constraints, and a solution 
if there exists one. A solution or goal state is a when all constraints are satisfied,
i.e. all desired tasks are scheduled in the time requested, if any, and the length
requested. If no solution exists, i.e. when the user wants to schedule 13 hours of 
Tasks when he/she only has 12 hours of free time available, the schedule outputted
in the resulting Calendar Assignment is undefined. */
function solveCSP(tasksDesired, freeTimes) {
	// Dictionary mapping time variables to their Task assignment.
	var timeVars = {}
	// Calendar Assignment to return initialized with the Task constraints and free times.
	var schedule = new objectPrototypes.CalendarAssignment(tasksDesired, freeTimes)
	// Initialize the dictionary of free time variables by the half hour.
	for (var i = 0; i < freeTimes.length; i++) {
		var currentFreeBlock = freeTimes[i].start
		while (currentFreeBlock < freeTimes[i].end){
			timeVars[currentFreeBlock] = null
			currentFreeBlock = currentFreeBlock + 0.5
		}
	}
	// Arbitrarily assign Tasks to free time by iterating through taskDesired and dictionary.
	var timesKeys = Object.keys(timeVars)
	var j = 0
	for (var k = 0; k < tasksDesired.length; k++) {
		var currentTask = tasksDesired[k]
		var neededTimeBlocks = currentTask.hours * 2
		while (neededTimeBlocks > 0){
			// If there are still unassigned time blocks, assign next available block to current Task.
			if (j < timesKeys.length) {
				timeVars[timesKeys[j]] = currentTask
  				neededTimeBlocks = neededTimeBlocks - 1
  				j = j + 1
  			}
	  		// If there are no more available time blocks then a valid assignment is impossible therefore return.
	  		else {	
	  			return;
	  		}
		}
	}
	// Swap constraint violating variable with another with epsilon chance of random swap.
	// Keep swapping until we run out of violated variables or have gone through max number of iterations.
	var illegalVars = constraintsViolated(timeVars)
	var iterations = 0
	while (illegalVars.length > 0 && iterations < maxIterations) {
		// Find a random index within illegal variables to be first time block to swap.
		var randomIndex1 = Math.floor(Math.random() * illegalVars.length)
		var randomTimeVar1 = illegalVars[randomIndex1]
		var randomTimeVar2 = null
		var probability = Math.random()
		// With a probability 1 - epsilon we find a second time block within the time frame that our first task needs for swap.
		if (probability > epsilon) {
			var task1TimeRange = timeVars[illegalVars[randomIndex1]].timeRange
			var randomTimeVar2Math = (Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start
			randomTimeVar2 = Math.floor(randomTimeVar2Math * 2)/2
			var iterations2 = 0
			while ((!(randomTimeVar2 in timeVars) || randomTimeVar2 == randomTimeVar1) && iterations2 < 100) {
				randomTimeVar2Math = (Math.random() * (task1TimeRange.end - task1TimeRange.start)) + task1TimeRange.start
				randomTimeVar2 = Math.floor(randomTimeVar2Math * 2)/2
				iterations2 = iterations2 + 1
			}
		}
		// With a probability of epsilon we swap first time var's assignment with a random free time's assignment.
		else {
			randomTimeVar2 = Math.floor(Math.random() * timesKeys.length * 2)/2
			var iterations3 = 0
			while ((!(randomTimeVar2 in timeVars) || randomTimeVar2 == randomTimeVar1) && iterations3 < 100) {
				randomTimeVar2 = Math.floor(Math.random() * timesKeys.length * 2)/2
				iterations3 = iterations3 + 1
			}
		}
		// Swap variable assignments.
		helpers.swapTimes(timeVars, illegalVars[randomIndex1], randomTimeVar2.toString())
		// Update violated contraints and iteration number.
		illegalVars = constraintsViolated(timeVars)
		iterations = iterations + 1
	}
	// If we reached the max number of iterations then that means we did not find a valid assignment.
	if (iterations == 1000) {
		return;
	}
	// Otherwise, we found a valid assignment, therefore return.
	else {
		schedule.halfHours = convertFormat(timeVars)
		return schedule
	}
}

// Helper function to convert dictionary of variable assignments to format for optimization algos.
function convertFormat(assignments){
	for (var time in assignments) {
		if (assignments[time] != undefined) {
			assignments[time] = assignments[time].name
		}
	}
	return assignments
}

// Helper function to check for constraints and if there are, return as a list.
function constraintsViolated(assignments){
	var violated = []
	for (var k in assignments){
		var task = assignments[k]
		if (task != null) {
			var allowedTime = task.timeRange
			if (k < allowedTime.start || k >= allowedTime.end) {
				violated.push(k)
			}
		}
	}
	return violated
}

export {
	solveCSP, convertFormat
}
