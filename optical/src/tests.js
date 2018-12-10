/* Mock data to test our algorithms. */
import {TimeRange, Task} from './objectPrototypes.js';
import {solveCSP} from './scheduleGenerator.js';
import {naiveHillClimbing, epsilonGreedyHillClimbing, simulatedAnnealing} from
  './optimizationAlgorithms.js';

var T1 = new Task("T1", 2, new TimeRange(9, 15));
var T2 = new Task("T2", 1.5, new TimeRange(11.5, 14));
var T3 = new Task("T3", 4, new TimeRange(0, 24));
var T4 = new Task("T4", 3.5, new TimeRange(19, 23));

// No solutions are possible with these constraints.
var noSolutionsTestData = {
  tasks: [
    new Task("T1", 2, new TimeRange(9, 15)),
    new Task("T2", 1.5, new TimeRange(11.5, 14)),
    new Task("T3", 4, new TimeRange(0, 24)),
    new Task("T4", 3.5, new TimeRange(19, 23))
  ],
  freeTime: [
    new TimeRange(9.5, 12),
    new TimeRange(13, 15),
    new TimeRange(15.5, 17),
    new TimeRange(18.5, 20),
    new TimeRange(21, 24)
  ]
};

// Only a few solutions are possible with these constraints.
var fewSolutionsTestData = {
  tasks: [
    new Task("T1", 2, new TimeRange(9, 15)),
    new Task("T2", 1.5, new TimeRange(11.5, 14)),
    new Task("T3", 4, new TimeRange(0, 24)),
    new Task("T4", 2.5, new TimeRange(19, 23))
  ],
  freeTime: [
    new TimeRange(9.5, 12),
    new TimeRange(13, 15),
    new TimeRange(15.5, 17),
    new TimeRange(18.5, 20),
    new TimeRange(21, 24)
  ]
};

// There are many solutions possible with these constraints.
var manySolutionsTestData = {
  tasks: [
    new Task("T1", 2, new TimeRange(0, 24)),
    new Task("T2", 1.5, new TimeRange(0, 24)),
    new Task("T3", 4, new TimeRange(0, 24)),
    new Task("T4", 3, new TimeRange(0, 24))
  ],
  freeTime: [
    new TimeRange(9.5, 12),
    new TimeRange(13, 15),
    new TimeRange(15.5, 17),
    new TimeRange(18.5, 20),
    new TimeRange(21, 24)
  ]
};

var manySolutionsMockCSPSolution = {
  tasks: manySolutionsTestData.tasks,
  halfHours: {
    "9.5": "T1",
    "10": "T3",
    "10.5": "T1",
    "11": "T2",
    "11.5": "T4",
    "13": "T2",
    "13.5": "T1",
    "14": "T3",
    "14.5": "T4",
    "15.5": "T3",
    "16": "T3",
    "16.5": "T3",
    "18.5": "T1",
    "19": "T3",
    "19.5": "T3",
    "21": "T4",
    "21.5": "T4",
    "22": "T2",
    "22.5": "T4",
    "23": "T3",
    "23.5": "T4"
  }
}

function runTest(testData) {
  console.log("");
  console.log("Beginning test.");
  var assignment = solveCSP(testData.tasks, testData.freeTime);
  if (assignment === undefined) {
    console.log("Failure to reach solution with CSP solver.");
  } else {
    console.log("CSP solver success. Here's the solution reached:");
    console.log(assignment);
    console.log("Next let's run optimization algorithms.");
    console.log("Here's naïve hill-climbing:");
    console.log(naiveHillClimbing(assignment));
    console.log("Here's epsilon-greedy hill-climbing:");
    console.log(epsilonGreedyHillClimbing(assignment));
    console.log("Finally, here's simulated annealing:");
    console.log(simulatedAnnealing(assignment));
    console.log("Great job - it all worked!");
  }
}

function runOptimizationAlgs(assignment) {
  console.log("CSP solver success. Here's the solution reached:");
  console.log(assignment);
  console.log("Next let's run optimization algorithms.");
  console.log("Here's naïve hill-climbing:");
  console.log(naiveHillClimbing(assignment));
  console.log("Here's epsilon-greedy hill-climbing:");
  console.log(epsilonGreedyHillClimbing(assignment));
  console.log("Finally, here's simulated annealing:");
  console.log(simulatedAnnealing(assignment));
  console.log("Great job - it all worked!");
}

function runTests() {
  // console.log(manySolutionsMockCSPSolution);
  // runOptimizationAlgs(manySolutionsMockCSPSolution);
  var tests = [
    ["no solutions", noSolutionsTestData],
    ["few solutions", fewSolutionsTestData],
    ["many solutions", manySolutionsTestData]
  ]
  for (var i = 0; i < tests.length; i++) {
    console.log("");
    console.log("Running test " + (i+1) + "/" +
                 tests.length + " (" + tests[i][0] + "): ");
    runTest(tests[i][1]);
    console.log("Done with testing suite.");
  }
}

export {
  runTests
}
