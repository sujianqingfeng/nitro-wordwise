type IAIProviderResult = {
	generateText: (options: { system: string; prompt: string }) => Promise<string>
}

export type IAIProvider<T> = (config: T) => IAIProviderResult
