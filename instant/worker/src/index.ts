import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Resource } from 'sst';

import { signUrl } from './build-client';

const app = new Hono();
app.use('/*', cors({ origin: '*', allowMethods: ['GET', 'PUT', 'POST'] }));
app.get('/', (c) => c.text('Hello, World!'));
const randomString = () => crypto.randomUUID();

app.get('/create-session', async (c) => {
	const kv = Resource.InstantDriveSessions;

	const key = randomString();
	await kv.put(key, JSON.stringify({ url: null, createdAt: +new Date() }));
	return c.json({ data: key, createdAt: +new Date() });
});
app.get('/get-session', async (c) => {
	const kv = Resource.InstantDriveSessions;

	const key = new URL(c.req.url).searchParams.get('session');
	if (!key) return c.json({ error: 'Invalid Key' });

	const data = await kv.get(key, 'json');
	return c.json({ data } as {});
});
app.get('/update-session', async (c) => {
	const kv = Resource.InstantDriveSessions;

	const u = new URL(c.req.url);
	const key = u.searchParams.get('session');
	if (!key) return c.json({ error: 'Invalid Key' });

	await kv.put(
		key,
		JSON.stringify({
			url: u.searchParams.get('url'),
			name: u.searchParams.get('name')?.substring(50) || 'download',
			createdAt: +new Date(),
		})
	);
	return c.json({ data: key, createdAt: +new Date() });
});

app.get('/sign', async (c) => {
	const path = `${+new Date()}/${randomString()}`;
	const res = await signUrl(
		{
			path,
			bucket: Resource.InstantDriveS3Compat.BucketName,
		},
		'put'
	);
	const url = `https://${Resource.InstantDriveBucketURL.url}/${path}`;
	return c.json({ data: { sign: res, path: url } });
});

export default app;
