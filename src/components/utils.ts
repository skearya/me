export function olderThanDay(date: Date): boolean {
	const dayAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
	return date <= dayAgo;
}
