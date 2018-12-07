/* Mock data to test our algorithms. */
import TimeRange, Task from './objectPrototypes.js';

// No solutions are possible with these constraints.
noSolutionsTest = {
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
fewSolutionsTest = {
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
manySolutionsTest = {
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
