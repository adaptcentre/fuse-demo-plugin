import { withPluginApi } from "discourse/lib/plugin-api";

// ---- ---- ---- ---- ---- ---- ---- ----
// ---- ---- ---- ---- ---- ---- ---- ----

export default {
  setupComponent(args, component) {
    withPluginApi('0.8.8', api => initializePlugin(api, component, args))
  },
};

function initializePlugin(api, component, args) {
	api.onPageChange( (url, title) => {

		let showLandingPage = isCorrectUrl( url );
    component.set('showLandingPage', false);

    if (showLandingPage) {
      component.set('showLandingPage', true);
      startProcess(component);
    } else {
      clearTimeout(clockTimeout);
    }
	});
}


///
///
///
///


// GLOBAL VARS
let aDayInMs = 86400000;

const COUNTDOWNDATE = new Date(new Date().getTime() + (aDayInMs * 90));
let clockTimeout = null;

//
//
//
//
function startProcess(component) {
	component.set('showCountdown', true);

  if (clockTimeout) {
    clearTimeout(clockTimeout);
    console.log('Clearing clockTimeout -> startProcess');
	}

	startTime(component);
}

function startTime(component) {
  let remainingTime = getRemainingTime(component);

  if (remainingTime > 0) {
    component.set('showCountdown', true);
  } else {
    component.set('showCountdown', false);
  }

  let p = processTime(component);

  p.then( () => {
    clockTimeout = setTimeout(() => {
      //console.log('clocktimeout');
      startTime(component)
    }, 500);
  });
}

function processTime(component) {
	let p = new Promise( (resolve) => {
		changeCountdownTime(component);

		resolve();
	});

	return p;
}

//
//
//
//
function changeCountdownTime(component) {
	let remainingTime = getRemainingTime(component);

	let days = Math.floor(remainingTime / (1000*60*60*24));
	let hours = Math.floor((remainingTime % (1000*60*60*24)) / (1000*60*60));
	let minutes = Math.floor((remainingTime % (1000*60*60)) / (1000*60));
	let seconds = Math.floor((remainingTime % (1000*60)) / (1000));

	let daysText = days === 1 ? 'day' : 'days';
	let hoursText = hours === 1 ? 'hour' : 'hours';
	let minutesText = minutes === 1 ? 'minute' : 'minutes';
	let secondsText = seconds === 1 ? 'second' : 'seconds';

	days = days.toString().padStart(2, '0');
	hours = hours.toString().padStart(2, '0');
	minutes = minutes.toString().padStart(2, '0');
	seconds = seconds.toString().padStart(2, '0');

	component.set('countdownDays', days);
	component.set('countdownHours', hours);
	component.set('countdownMinutes', minutes);
	component.set('countdownSeconds', seconds);

	component.set('countdownDaysText', daysText);
	component.set('countdownHoursText', hoursText);
	component.set('countdownMinutesText', minutesText);
	component.set('countdownSecondsText', secondsText);
}

function getRemainingTime(component) {
  let countdownDate = COUNTDOWNDATE;

	let remaining = countdownDate - new Date();

	return remaining;
}

//
function isCorrectUrl( url ) {

  if( url === '/' ) {
    return true;
  }

  return false;
}
