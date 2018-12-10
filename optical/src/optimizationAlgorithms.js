/* Contains algorithms used for optimization of initial calendar assignments, to
   account for user preferences and common-sense notions about good schedules.
   Currently the utility function is calculated to prefer longer periods of time
   spent on individual tasks rather than too much switching, and also to prefer
   schedules that have events concentrated near 3 pm. */
import {Event} from './objectPrototypes.js';
import {swapTimes, inTaskTimeRange, randomKey} from './helpers.js';

// Changeable weights for our utility function
const CONSOLIDATION_WEIGHT = 1;
const DAY_CENTER_WEIGHT = 0.1;
// Included so we have no divide-by-zero errors
const UTILITY_EPSILON = 0.0001;
// Used in epsilon-greedy hill climbing
const OPTIMIZATION_EPSILON = 0.01;
// Used in simulated annealing
const INITIAL_TEMPERATURE = 1000;
const ALPHA = 0.95;
// Don't try anything too many times
const MAX_REPS = 10000;

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
        blocks.push(new Event(currentTask, currentStartingTime, timeAmount));
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
    blocks.push(new Event(currentTask, currentStartingTime, timeAmount));
  }

  return blocks;
}

// Sum up distances of work chunks from a specific time in the day in an asst
function totalDistFromCenterTime(halfHours, centerTime) {
  var sum = 0;
  var t = 0;

  while (t < 24) {
    if (t in halfHours && halfHours[t] !== null) {
      sum += Math.abs(centerTime - t);
    }
    t += 0.5;
  }

  return sum;
}

// Utility function for a particular calendar assignment.
function utility(halfHours) {
  // Sum the squares of lengths of blocks in the assignment to promote longer
  // blocks of work on a single task
  var blocks = getBlocks(halfHours);
  // console.log(blocks);
  var squaredBlockSum = blocks.map(event => Math.pow(event.length, 2))
                              .reduce((a, b) => a + b, 0);
  // console.log(squaredBlockSum);

  // Divide this by the total distance of all half-hour blocks of work from
  // 3 pm, the center of most college students' working days
  var distanceSum = totalDistFromCenterTime(halfHours, 15);

  var result = (CONSOLIDATION_WEIGHT * squaredBlockSum) -
           (DAY_CENTER_WEIGHT * distanceSum);
  return result;
}

// get task by name; deal with nulls also
function getTask(tasks, taskName) {
  if (taskName == null) {
    return null;
  } else {
    return tasks.find(e => e.name === taskName);
  }
}

// Find a neighboring calendar assignment by swapping two half-hour chunks and
// make sure it doesn't violate any time ranges on tasks
function findNeighbor(assignment) {
  var newAssignment = null;
  var success = false;
  var reps = 0;

  while (!success && reps < MAX_REPS) {
    var time1 = randomKey(assignment.halfHours);
    var time2 = time1;
    while (time2 === time1) {
      time2 = randomKey(assignment.halfHours);
    }

    // Check for constraint violation
    var task1 = getTask(assignment.tasks, assignment.halfHours[time1]);
    var task2 = getTask(assignment.tasks, assignment.halfHours[time2]);
    if (inTaskTimeRange(task1, time2) && inTaskTimeRange(task2, time1)) {
      newAssignment = JSON.parse(JSON.stringify(assignment));
      newAssignment.halfHours[time1] = assignment.halfHours[time2];
      newAssignment.halfHours[time2] = assignment.halfHours[time1];
      success = true;
    }
    reps += 1;
  }

  return newAssignment;
}

// Naïve hill-climbing algorithm for bettering CSP assignments
function naiveHillClimbing(assignment) {
  var reps = 0;
  while (reps < MAX_REPS) {
    var neighbor = findNeighbor(assignment);

    if (neighbor === undefined) {
      // Likely no neighbors exist, so break
      break;
    }

    // console.log("original utility: " + utility(assignment.halfHours));
    // console.log("neighboring utility: " + utility(neighbor.halfHours));

    if (utility(neighbor.halfHours) > utility(assignment.halfHours)) {
      console.log("we found something better!!!!");
      assignment = JSON.parse(JSON.stringify(neighbor));
      reps = 0;
    } else {
      reps += 1;
    }
  }
  return assignment;
}

// Hill-climbing algorithm incorporating epsilon probability of random swapping
function epsilonGreedyHillClimbing(assignment) {
  var reps = 0;
  var rnd;
  var max_util = 0;

  while (reps < MAX_REPS) {
    var neighbor = findNeighbor(assignment);
    if (neighbor === undefined) {
      break;
    }

    // Promote random exploration with prb of epsilon
    rnd = Math.random();
    if (rnd <= OPTIMIZATION_EPSILON) {
      assignment = JSON.parse(JSON.stringify(neighbor));
    } else {
      if (utility(neighbor.halfHours) > utility(assignment.halfHours)) {
        assignment = JSON.parse(JSON.stringify(neighbor));
      }
    }

    // If we improved, set reps to 0; otherwise, add 1
    var assignmentUtility = utility(assignment.halfHours);
    if (assignmentUtility > max_util) {
      max_util = assignmentUtility;
      reps = 0;
    } else {
      reps += 1;
    }
  }
  return assignment;
}

// Simulated annealing algorithm
function simulatedAnnealing(assignment) {
  var reps = 0;
  var temperature = INITIAL_TEMPERATURE;
  var max_util = 0;
  var rnd;

  while (reps < MAX_REPS) {
    // Generate neighbor
    var neighbor = findNeighbor(assignment);
    if (neighbor === undefined) {
      break;
    }

    var neighborUtility = utility(neighbor.halfHours);
    var assignmentUtility = utility(assignment.halfHours);

    // If better immediately accept
    if (neighborUtility > assignmentUtility) {
      console.log("we found something better!!!!");
      assignment = JSON.parse(JSON.stringify(neighbor));
    } else {
      // Otherwise accept with temperature-based probability
      var probability = Math.exp(-(neighborUtility - assignmentUtility)
                    / temperature);
      rnd = Math.random()
      if (probability <= rnd) {
        assignment = JSON.parse(JSON.stringify(neighbor));
      }
    }

    // Decrease temperature
    temperature *= ALPHA;

    assignmentUtility = utility(assignment.halfHours);
    if (assignmentUtility > max_util) {
      max_util = assignmentUtility;
      reps = 0;
    } else {
      reps += 1;
    }
  }
  return assignment;
}

export {
  naiveHillClimbing, epsilonGreedyHillClimbing, simulatedAnnealing
}
