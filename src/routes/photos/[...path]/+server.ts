import { publicPath } from '$lib/server/utils';
import fs from 'fs';
import type { RequestHandler } from '../$types';
import path from 'path';

export const GET: RequestHandler = ({ params }) => {
	const data = fs.readFileSync(publicPath(path.join('photos', params.path)));
	return new Response(data);
};
