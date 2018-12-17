/* Contains algorithms used for optimization of initial calendar assignments, to
   account for user preferences and common-sense notions about good schedules.
   Currently the utility function is calculated to prefer longer periods of time
   spent on individual tasks rather than too much switching, and also to prefer
   schedules that have events concentrated near 3 pm. */
import {swapTimes, inTaskTimeRange, randomKey, getBlocks} from './helpers.js';

// Changeable weights for our utility function
const CONSOLIDATION_WEIGHT = 1;
const SIMILAR_BLOCK_SIZE_WEIGHT = 0.1;
const FEW_BLOCKS_WEIGHT = 10;
const DAY_CENTER_WEIGHT = 0.1;
// Used in epsilon-greedy hill climbing
const OPTIMIZATION_EPSILON = 0.01;
// Used in simulated annealing
const INITIAL_TEMPERATURE = 100000;
const ALPHA = 0.995;
// Don't try anything too many times
const MAX_REPS = 10000;

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
  // Sum the lengths of blocks in the assignment to promote longer
  // blocks of work on a single task
  var blocks = getBlocks(halfHours);
  // Subtract the number of blocks, weighted by a different factor; we want to
  // promote few blocks per day
  var blockCount = blocks.length;
  // console.log(blocks);
  var blockLengths = blocks.map(event => event.length);
  var blockAverageLength = blockLengths.reduce((a, b) => a + b, 0) / blockCount;
  var blockVarianceSum = blockLengths.map(len => Math.pow
                                         (len - blockAverageLength, 2))
                                     .reduce((a, b) => a + b, 0);
  var squaredBlockSum = blockLengths.map(len => Math.pow(len, 2))
                                    .reduce((a, b) => a + b, 0);
  // console.log(squaredBlockSum);

  // Divide this by the total distance of all half-hour blocks of work from
  // 3 pm, the center of most college students' working days
  var distanceSum = totalDistFromCenterTime(halfHours, 15);

  var result = (CONSOLIDATION_WEIGHT * squaredBlockSum)
                - (SIMILAR_BLOCK_SIZE_WEIGHT * blockVarianceSum)
                - (FEW_BLOCKS_WEIGHT * blockCount)
                - (DAY_CENTER_WEIGHT * distanceSum);
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
      assignment = JSON.parse(JSON.stringify(neighbor));
      reps = 0;
    } else {
      reps += 1;
    }
  }
  // return [assignment, utility(assignment.halfHours)];
  return assignment;
}

// Hill-climbing algorithm incorporating epsilon probability of random swapping
function epsilonGreedyHillClimbing(assignment) {
  var reps = 0;
  var rnd;
  var maxUtil = null;
  var bestAssignment = null;

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
    if (maxUtil === null || assignmentUtility > maxUtil) {
      maxUtil = assignmentUtility;
      bestAssignment = assignment;
      reps = 0;
    } else {
      reps += 1;
    }
  }
  // Return the best-quality assignment we could find
  // return [bestAssignment, maxUtil];
  return bestAssignment;
}

// Simulated annealing algorithm
function simulatedAnnealing(assignment) {
  var reps = 0;
  var temperature = INITIAL_TEMPERATURE;
  var maxUtil = null;
  var bestAssignment = null;
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
      assignment = JSON.parse(JSON.stringify(neighbor));
    } else {
      // Otherwise accept with temperature-based probability
      var probability = Math.exp(neighborUtility - assignmentUtility
                    / temperature);
      rnd = Math.random()
      if (rnd <= probability) {
        assignment = JSON.parse(JSON.stringify(neighbor));
      }
    }

    // Decrease temperature
    temperature *= ALPHA;

    assignmentUtility = utility(assignment.halfHours);
    if (maxUtil === null || assignmentUtility > maxUtil) {
      // console.log("better is", assignmentUtility);
      maxUtil = assignmentUtility;
      bestAssignment = assignment;
      reps = 0;
    } else {
      reps += 1;
    }
  }
  // return [bestAssignment, maxUtil];
  return bestAssignment;
}

export {
  naiveHillClimbing, epsilonGreedyHillClimbing, simulatedAnnealing,
  utility
}
