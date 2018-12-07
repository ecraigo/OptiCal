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
};

function findTaskByName(assignment, taskName) {
	if (taskName === null) {
		return null;
	} else {
		return assignment.tasks.find(e => e.name === taskName);
	}
}

export {
	swapTimes, inTaskTimeRange, randomKey
}
