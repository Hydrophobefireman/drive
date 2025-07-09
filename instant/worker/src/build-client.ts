import { AwsClient } from 'aws4fetch';
import { Resource } from 'sst';

const SEVEN_DAYS = 604800;
export function buildClient() {
	const { R2_ACCESS_KEY_ID, R2_ACCESS_KEY_SECRET } = Resource;
	return new AwsClient({
		accessKeyId: R2_ACCESS_KEY_ID.value,
		secretAccessKey: R2_ACCESS_KEY_SECRET.value,
	});
}
export async function signUrl(config: { path: string; bucket: string }, method: string) {
	const r2 = buildClient();
	const { BucketName, AccountId } = Resource.InstantDriveS3Compat;

	const endpoint = new URL(`https://${BucketName}.${AccountId}.r2.cloudflarestorage.com`);
	endpoint.pathname = config.path;
	endpoint.searchParams.set('X-Amz-Expires', SEVEN_DAYS.toString());
	const signed = await r2.sign(new Request(endpoint, { method: method }), { aws: { signQuery: true } });
	return signed.url;
}
