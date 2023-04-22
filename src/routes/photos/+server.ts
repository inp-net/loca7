import { publicPath } from '$lib/server/utils.js';
import fs from 'fs';
export function GET({ url }) {
	var name = url.searchParams.get('file') ?? '';
	const data = fs.readFileSync(publicPath(name));
	return new Response(data);
}
