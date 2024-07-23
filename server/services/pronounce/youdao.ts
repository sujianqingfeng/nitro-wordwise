import { createHash } from "node:crypto"
const SECRET_KEY = "U3uACNRWSDWdcsKm"

function createMd5Sign(input: string) {
	return createHash("md5").update(input).digest("hex")
}

function removeEmptyValues(obj: Record<string, any>) {
	for (const key of Object.keys(obj)) {
		if (obj[key] === "") {
			delete obj[key]
		}
	}
}

export function generatePronounceUrl(word: string, type: string) {
	const inputData = {
		product: "webdict",
		appVersion: 1,
		client: "web",
		mid: 1,
		vendor: "web",
		screen: 1,
		model: 1,
		imei: 1,
		network: "wifi",
		keyfrom: "dick",
		keyid: "voiceDictWeb",
		mysticTime: Date.now(),
		yduuid: "abcdefg",
		le: "",
		phonetic: "",
		rate: 4,
		word,
		type,
		id: "",
	}

	const newInputData: Record<string, any> = {
		...inputData,
	}
	removeEmptyValues(newInputData)

	const sortedKeys = Object.keys(newInputData).sort()
	sortedKeys.push("key")
	newInputData.key = SECRET_KEY

	const signQueryString = sortedKeys
		.map((key) => `${key}=${newInputData[key]}`)
		.join("&")

	const sign = createMd5Sign(signQueryString)
	const pointParam = sortedKeys.join(",")

	const signData: Record<string, any> = {
		...inputData,
		sign,
		pointParam,
	}

	const queryString = Object.keys(signData)
		.map((k) => {
			return "".concat(k, "=").concat(signData[k])
		})
		.join("&")

	const url = `https://dict.youdao.com/pronounce/base?${queryString}`
	return url
}
