import { publicPath } from '$lib/server/utils';
import fs from 'fs';
import type { RequestHandler } from '../$types';

export const GET: RequestHandler = ({ params }) => {
	const data = fs.readFileSync(publicPath(params.path));
	return new Response(data);
};
