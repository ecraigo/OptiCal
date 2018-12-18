import {CalendarEvent} from './objectPrototypes.js';

function swapTimes(assignments, hour1, hour2){
	var hour1Assignment = assignments[hour1]
	assignments[hour1] = assignments[hour2]
	assignments[hour2] = hour1Assignment
}

// Given a Task object and a time in hours from midnight, return true if this
// time is legal for this task and false otherwise.
function inTaskTimeRange(task, time) {
	if (task === null) {
		return true;
	} else {
		return task.timeRange.start <= time && time < task.timeRange.end;
	}
}

// Adapted from answer by Lawrence Whiteside from StackOverflow; good way to
// choose a random key from an object
function randomKey(obj) {
    var keys = Object.keys(obj)
    return keys[keys.length * Math.random() << 0];
}

function findTaskByName(assignment, taskName) {
	if (taskName === null) {
		return null;
	} else {
		return assignment.tasks.find(e => e.name === taskName);
	}
}

// Consolidate times on calendar day into "blocks" spent on a particular task,
// and return these blocks.
function getBlocks(halfHours) {
  // deep copy
  halfHours = JSON.parse(JSON.stringify(halfHours));
  var blocks = [];
  var currentTask = null;
  var nextTask = null;
  var currentStartingTime = 0;
  var timeAmount = 0;
  var t = 0;

  // Assign null to unassigned hours, to avoid unreadable code below
  while (t < 24) {
    if (!(t.toString() in halfHours)) {
      halfHours[t] = null;
    }
    t += 0.5
  }

  t = 0;
  while (t < 24) {
    nextTask = halfHours[t];
    // Assign new block
    if (nextTask !== currentTask) {
      if (currentTask !== null) {
        blocks.push(new CalendarEvent(currentTask, currentStartingTime,
																			timeAmount));
      }
      // Reset
      currentTask = nextTask;
      currentStartingTime = t;
      timeAmount = 0.5;

    // Add time to block if not free time
    } else if (currentTask !== null) {
      timeAmount += 0.5;
    }

    t += 0.5;
  }
  // Add ending block
  if (currentTask !== null) {
    blocks.push(new CalendarEvent(currentTask, currentStartingTime,
																	timeAmount));
  }

  return blocks;
}

export {
	swapTimes, inTaskTimeRange, randomKey, getBlocks, findTaskByName
}
