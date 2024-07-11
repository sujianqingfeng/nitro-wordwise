type ITranslatorProviderResult = {
	translate: (text: string) => Promise<string>
}

export type ITranslatorProvider<T> = (config: T) => ITranslatorProviderResult
