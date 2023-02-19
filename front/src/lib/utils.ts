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

export function distanceDisplay(distance: number): string {
	return Intl.NumberFormat('fr-FR', {
		style: 'unit',
		unit: distance < 0.5 ? 'meter' : 'kilometer'
	}).format(distance < 0.5 ? distance * 1e3 : distance);
}

export function availableAtSentence(availableSince: number, availableAt: string): string {
	let out = '';
	console.log(availableSince);
	if (availableAt === new Date().toISOString()) {
		out += "Se libère aujourd'hui";
	} else if (availableSince > 0) {
		out += 'Libéré depuis le ';
	} else {
		out += 'Se libère le ';
	}
	if (availableSince !== 0) {
		out += new Intl.DateTimeFormat('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(availableAt));
	}

	return out;
}


export function readableOn(color: string): string {
	const rgb = color.replace(/^#/, '').match(/.{2}/g);
	if (rgb === null) throw new Error('Invalid color, use hex notation');
	const o = Math.round(
		(parseInt(rgb[0], 16) * 299 + parseInt(rgb[1], 16) * 587 + parseInt(rgb[2], 16) * 114) / 1000
	);
	return o > 125 ? '#000000' : '#ffffff';
}
