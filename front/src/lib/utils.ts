export function durationDisplay(seconds: number) {
	const minute = 60;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 31;
	const year = month * 12;
	const century = year * 100;
	let displayString = '';
	let base = 0;
	if (seconds < 1) {
		displayString = "moins d'une seconde";
	} else if (seconds < minute) {
		base = Math.round(seconds);
		displayString = `${base} ${base === 1 ? 'seconde' : 'secondes'}`;
	} else if (seconds < hour) {
		base = Math.round(seconds / minute);
		displayString = `${base} ${base === 1 ? 'minute' : 'minutes'}`;
	} else if (seconds < day) {
		base = Math.round(seconds / hour);
		displayString = `${base} ${base === 1 ? 'heure' : 'heures'}`;
	} else if (seconds < week) {
		base = Math.round(seconds / day);
		displayString = `${base} ${base === 1 ? 'jour' : 'jours'}`;
	} else if (seconds < month) {
		base = Math.round(seconds / week);
		displayString = `${base} ${base === 1 ? 'semaine' : 'semaines'}`;
	} else if (seconds < year) {
		base = Math.round(seconds / month);
		displayString = `${base} mois`;
	} else if (seconds < century) {
		base = Math.round(seconds / year);
		displayString = `${base} ${base === 1 ? 'an' : 'ans'}`;
	} else {
		displayString = 'des siècles';
	}
	return displayString;
}
