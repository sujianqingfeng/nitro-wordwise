import { YouDaoDictionaryService } from "./youdao"

function createDictionaryService() {
	return new YouDaoDictionaryService()
}

export const dictionary = createDictionaryService()
