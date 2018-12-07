

function solveCSP(today) {
  window.gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': today.toISOString(),
    'timeMax': (new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  }).then(function(response) {
    console.log(response.result.items)
  });
}

export {
	solveCSP
}