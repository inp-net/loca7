import type { EventAttributes } from 'ics';
import { createEvent, type DateArray, type DurationObject } from 'ics';
import slugify from 'slugify';
import type { GeographicPoint } from './types';

function toDateArray(date: Date): DateArray {
	return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
}

export async function ics({
	start,
	duration,
	url,
	location,
	title,
	description,
	busy,
	organizer,
	status,
	attendees
}: {
	start: Date;
	duration: DurationObject;
	url: string;
	location: GeographicPoint | null;
	title: string;
	description: string;
	busy: EventAttributes['busyStatus'];
	status: EventAttributes['status'];
	organizer: { email: string; name: string; phone?: string };
	attendees: { email: string; name: string; phone?: string }[];
}): Promise<{ url: string; filename: string }> {
	return new Promise((resolve, reject) => {
		let filename = `${slugify(title)}.ics`;
		let event: EventAttributes = {
			start: toDateArray(start),
			duration,
			title,
			busyStatus: busy,
			organizer: { name: organizer.name, email: organizer.email },
			attendees: attendees.map((attendee) => ({
				name: attendee.name,
				email: attendee.email
			})),
			url,
			status
		};

		if (description.includes('<')) {
			event.htmlContent = description;
		} else {
			event.description = description;
		}

		if (location) {
			event.geo = {
				lat: location.latitude,
				lon: location.longitude
			};
		}
		createEvent(event, (error, value) =>
			error
				? reject(error)
				: resolve({
						url: URL.createObjectURL(
							new File([value], filename, { type: 'text/calendar' })
						),
						filename
				  })
		);
	});
}
