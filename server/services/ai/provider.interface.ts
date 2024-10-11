export type AsyncIterableStream<T> = AsyncIterable<T> & ReadableStream<T>

type IAIProviderResult = {
	generateText: (options: { system: string; prompt: string }) => Promise<string>
	streamText: (options: {
		system: string
		prompt: string
	}) => Promise<AsyncIterableStream<string>>
}

export type IAIProvider<T> = (config: T) => IAIProviderResult
