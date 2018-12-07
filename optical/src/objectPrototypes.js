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

/* Object representing calendar assignment. This contains all information
   needed to run our algorithms. Takes in a list of tasks and a list of free,
   non-overlapping TimeRange objects representing our free times. Returns an
   assignment with all our free time mapped to undefined. For now, only deals
   with a single day. */
function CalendarAssignment(tasks, freeTime) {
  this.tasks = tasks
  this.hours = {}

  freeTime.forEach(function(timeRange){
    var t = timeRange.start;
    while (t < timeRange.end) {
      this.hours[t] = undefined;
      t += 0.5;
    }
  });
}

export {
  TimeRange, Task, CalendarAssignment
}
