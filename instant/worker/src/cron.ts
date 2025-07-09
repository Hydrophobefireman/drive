import { Resource } from 'sst';

function isMoreThanADayOld(timestamp: number): boolean {
	const oneDayInMs = 86_400_000;
	const currentTime = Date.now();
	const diffInMs = currentTime - timestamp;
	return diffInMs >= oneDayInMs;
}
async function handleR2() {
	const bucket = Resource.InstantDrive;
	const { objects } = await bucket.list();

	const objectsToDelete = [];

	for (const object of objects || []) {
		const lastModified = +object.uploaded;
		if (isMoreThanADayOld(lastModified)) {
			objectsToDelete.push(object.key);
		}
	}

	if (objectsToDelete.length > 0) {
		console.log(`Deleting ${objectsToDelete.length} objects...`);
		await bucket.delete(objectsToDelete);
		console.log('Objects deleted.');
	} else {
		console.log('No objects to delete.');
	}
}

async function handleKv() {
	const kv = Resource.InstantDriveSessions;
	const { keys } = await kv.list({});

	const toDel = (
		await Promise.all(
			keys.map(async (key) => {
				const resp: any = await kv.get(key.name, 'json');
				if (isMoreThanADayOld(resp.createdAt)) {
					console.log(key);
					return key;
				}
				return null;
			})
		)
	).filter(Boolean);
	if (toDel.length) await Promise.all(toDel.map((k) => kv.delete(k!.name)));
	return toDel;
}
export default {
	async scheduled(event, env, ctx): Promise<void> {
		await handleKv();
		await handleR2();
	},
} satisfies ExportedHandler<Env>;
