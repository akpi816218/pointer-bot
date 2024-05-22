export interface Event {
	name: string;
	once: boolean;
	execute: (...args: unknown[]) => Promise<void>;
}

export type Writable<T> = { -readonly [P in keyof T]: T[P] };
