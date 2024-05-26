export async function arrayFromAsync<T>(
	source: Iterable<T> | AsyncIterable<T>
): Promise<T[]> {
	const items: T[] = [];
	for await (const item of source) items.push(item);
	return items;
}

export function truncString(str: string, max: number) {
	if (str.length <= max) return str;
	// eslint-disable-next-line prefer-template
	return str.slice(0, max - 3) + '...';
}
