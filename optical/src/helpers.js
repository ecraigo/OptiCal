function swapTimes(assignments, hour1, hour2){
	var hour1Assignment = assignments[hour1]
	assignments[hour1] = assignments[hour2]
	assignments[hour2] = assignments[hour1Assignment]
}

export {
	swapTimes
}