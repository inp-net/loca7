import { publicPath } from '$lib/server/utils';
import fs from 'fs';
import type { RequestHandler } from '../$types';
import path from 'path';

export const GET: RequestHandler = ({ params }) => {
	const filepath = publicPath(path.join('photos', params.path));
	const exists = fs.existsSync(filepath);
	if (!exists) return new Response(null, { status: 404 });
	const data = fs.readFileSync(filepath);
	return new Response(data);
};
