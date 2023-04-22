import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export function checksumFile(filepath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash('sha1');
		const stream = fs.createReadStream(filepath);
		stream.on('error', (err) => reject(err));
		stream.on('data', (chunk) => hash.update(chunk));
		stream.on('end', () => resolve(hash.digest('hex')));
	});
}

/**
 * Join the given path with the server's public directory: `public/` in dev, `build/client/` in prod.
 * @param relativePath the path to give, relative to the public directory
 */
export function publicPath(relativePath: string): string {
	if (process.env.NODE_ENV === 'development') {
		return path.join('public', relativePath);
	}
	return path.join('build', 'client', relativePath);
}

export function valueOfBooleanString(str: string | undefined): boolean {
	return str === 'true';
}
