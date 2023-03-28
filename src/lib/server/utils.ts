import crypto from 'crypto';
import fs from 'fs';

export function checksumFile(filepath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash('sha1');
		const stream = fs.createReadStream(filepath);
		stream.on('error', (err) => reject(err));
		stream.on('data', (chunk) => hash.update(chunk));
		stream.on('end', () => resolve(hash.digest('hex')));
	});
}

