export async function arrayFromAsync<T>(
	source: Iterable<T> | AsyncIterable<T>
): Promise<T[]> {
	const items: T[] = [];
	for await (const item of source) items.push(item);
	return items;
}
