import { z } from 'zod';
import type {
	MetroLine,
	PublicTransportStation,
	TADLine,
	TramLine
} from './types';

// source of colors: wikipedia.org, wikimedia.org

export default function publicTransportColor({
	line,
	type,
	color
}: Pick<PublicTransportStation, 'line' | 'type' | 'color'>): string | undefined {
	if (color) return color;
	switch (type) {
		case 'bus':
			return Object.entries(busLinesByColor).find(([_, lines]) =>
				lines.includes(line.toLowerCase())
			)?.[0];
		case 'bhnf':
			return '#F06526';
		case 'tad':
			return TADColorsByLine[line];

		case 'metro':
			return metroColorsByLine[line];

		case 'tram':
			return tramColorsByLine[line];
	}
}

type ColorMap<K extends string | number | symbol> = Record<K, `#${string}`>;

export const TADColorsByLine: ColorMap<TADLine> = {
	'105': '#F295BF',
	'106': '#A7CD39',
	'118': '#ED1C25',
	'119': '#F47D31',
	'120': '#004A8D',
	'201': '#F295BF',
	'202': '#A7CE39',
	'204': '#ED1C25',
	'205': '#41C8F4'
};

export const tramColorsByLine: ColorMap<TramLine> = {
	T1: '#224c8f',
	T2: '#4299da'
};

export const metroColorsByLine: ColorMap<MetroLine> = {
	A: '#e51b24',
	B: '#fddd04',
	C: '#52b149'
};

export const busLinesByColor = {
	'#007C52': ['12', '20', '21', '39', '48', '66', '112', '115', '310', 'zénith'],
	'#E675A7': ['11', '63', '67', '70', '104', '201', '303', '306', '313', 'ville'],
	'#3F2682': ['13', '25', '59', '60', '80', '102', '312'],
	'#BB9DC6': ['14', '65', '69', '75', '88', '101', 'stadium'],
	'#A0670F': ['15', '23', '26', '32', '36', '50', '76', '315'],
	'#E46809': [
		'17',
		'18',
		'34',
		'37',
		'41',
		'42',
		'51',
		'54',
		'109',
		'113',
		'302',
		'317',
		'aéroport'
	],
	'#58AC25': ['19', '27', '35', '43', '45', '56', '58', '71', '77', '103', '114', '202', '311'],
	'#DC006B': ['29', '40', '46', '81', '83', '111', '121', '301', '304', 'noctambus'],
	'#0098D4': [
		'30',
		'33',
		'38',
		'44',
		'53',
		'79',
		'84',
		'110',
		'116',
		'117',
		'150',
		'205',
		'305',
		'320',
		'cimetières'
	],
	'#572F08': ['31', '57', '68', '152'],
	'#DB001B': ['47', '55', '61', '73', '78', '82', '204', '314', 'stade ernest-wallon'],
	'#004687': ['49', '72', '87', '151', '316'],
	'#10778C': ['hôpital rangueil']
};
