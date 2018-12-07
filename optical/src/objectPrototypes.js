/* Contains object constructors necessary for task definitions inputted into
   the CSP-solver and optimization algorithms. */

/* Object for range of time in a day a task can be carried out
   Both times floats in [0, 24) representing hours elapsed since midnight. */
function TimeRange(start, end) {
  // Time user may start task work
  this.start = start;
  // Time user must finish task work
  this.end = end;
}

/* Object for tasks inputted by the user. */
function Task(name, hours, timeRange) {
  // Name of task
  this.name = name;
  // Number of hours in day/week user must spend on this task
  this.hours = hours;
  // Legal time range for this task
  this.timeRange = timeRange;
}

export {
  TimeRange, Task
}
