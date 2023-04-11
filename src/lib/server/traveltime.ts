import { DISPLAY_PUBLIC_TRANSPORT_TYPE, type GeographicPoint } from '$lib/types';
import { distanceBetween } from '$lib/utils';
import type { PublicTransportType, PublicTransportStation } from '$lib/types';

class OpenRouteService {
	key: string;

	constructor(key: string) {
		this.key = key;
	}

	async _fetch(path: string, params: Record<string, string>) {
		const paramsString = Object.entries({ ...params, api_key: this.key })
			.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			.join('&');
		const response = await fetch(
			`https://api.openrouteservice.org/v2/${path}?${paramsString}`,
			{}
		);
		return response.json();
	}

	/**
	 * Result is in seconds.
	 */
	async travelTime(
		method: 'foot' | 'bike',
		start: GeographicPoint,
		end: GeographicPoint
	): Promise<number> {
		const response = await this._fetch(
			`directions/${
				{
					foot: 'foot-walking',
					bike: 'cycling-road'
				}[method]
			}`,
			{
				start: `${start.latitude},${start.longitude}`,
				end: `${end.latitude},${end.longitude}`
			}
		);
		return response.features[0].properties.summary.duration;
	}
}

class Tisseo {
	key: string;

	constructor(key: string) {
		this.key = key;
	}

	async _fetch(service: string, params: Record<string, string>) {
		params.key = this.key;
		const response = await fetch(
			`https://api.tisseo.fr/v2/${service}.json?${Object.entries(params)
				.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
				.join('&')}`
		);
		return response.json();
	}

	async travelTime(start: GeographicPoint, end: GeographicPoint): Promise<number> {
		const durationString = await this._fetch('journeys', {
			departurePlaceXY: `${start.longitude},${start.latitude}`,
			arrivalPlaceXY: `${end.longitude},${end.latitude}`
		});
		throw new Error('Not implemented');
	}

	async nearbyStations(
		location: Partial<GeographicPoint>,
		fetch: typeof window.fetch
	): Promise<PublicTransportStation[]> {
		if (!location.latitude || !location.longitude) {
			return [];
		}
		const allStops = (await (await fetch('/tisseo-stops.json')).json()) as {
			stop_id: `stop_point:SP_${number}`;
			stop_code: `${number}`;
			stop_name: string;
			stop_lat: number;
			stop_lon: number;
			route_type:
				| 'tram'
				| 'metro'
				| 'train'
				| 'bus'
				| 'ferry'
				| 'cable_car'
				| 'gondola'
				| 'funicular'
				| 'trolleybus'
				| 'monorail';
			parent_station: `stop_area:SA_${number}`;
			wheelchair_boarding: boolean | null;
			route_id: string;
			agency_id: string;
			route_short_name: string;
			route_long_name: string;
			route_color: string;
			route_text_color: string;
			location_type: 'stop' | 'station' | 'entrance' | 'generic' | 'boarding_area';
		}[];

		return allStops
			.map((stop) => ({
				...stop,
				position: { latitude: stop.stop_lon, longitude: stop.stop_lat }
			}))
			.filter((stop) => Object.keys(DISPLAY_PUBLIC_TRANSPORT_TYPE).includes(stop.route_type))
			.filter((stop) => Math.abs(distanceBetween(location, stop.position)) < 500)
			.sort(
				(a, b) =>
					distanceBetween(location, a.position) - distanceBetween(location, b.position)
			)
			.filter(
				(stop, i, self) =>
					self.findIndex(
						(s) =>
							s.route_short_name === stop.route_short_name &&
							s.route_type === stop.route_type
					) === i
			)
			.map((stop) => ({
				color: '#' + stop.route_color,
				line: stop.route_short_name,
				name: stop.stop_name,
				type:
					stop.route_type === 'bus' && /L\d{1,3}/.test(stop.route_short_name)
						? 'bhnf'
						: (stop.route_type as PublicTransportType),
				latitude: stop.stop_lon,
				longitude: stop.stop_lat
			}));
	}
}

const openRouteService = new OpenRouteService(process.env.OPENROUTESERVICE_KEY ?? '');
const tisseo = new Tisseo(process.env.TISSEO_KEY ?? '');

export { openRouteService, tisseo };
