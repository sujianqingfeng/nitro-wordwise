import { createSafePromise } from "~/utils/basic"
import type {
	IDictionaryProvider,
	IDictionaryTranslation,
} from "./provider.interface"
import { createHash } from "node:crypto"
import { USER_AGENT } from "~/constants"

const DICT_URL = "https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4"
const KEY_FROM = "webdict"

type YouDaoResp = {
	ec?: {
		word: {
			usphone: string
			ukphone: string
			ukspeech: string
			usspeech: string
			trs: { pos: string; tran: string }[]
			wfs: { wf: { name: string; value: string } }[]
			prototype: string
		}
		exam_type: string[]
	}
}

export function createYDSign(text: string) {
	return createHash("md5").update(text).digest("hex")
}

export class YouDaoDictionaryService implements IDictionaryProvider {
	getSpeechUrl(speech?: string) {
		return speech ? `https://dict.youdao.com/dictvoice?audio=${speech}` : ""
	}

	async query(word: string) {
		const r = createYDSign("".concat(word).concat(KEY_FROM))
		const time = "".concat(word).concat(KEY_FROM).length % 10
		const body = {
			q: word,
			le: "en",
			client: "web",
			keyfrom: KEY_FROM,
			t: `${time}`,
			sign: createYDSign(
				""
					.concat("web")
					.concat(word)
					.concat(`${time}`)
					.concat("Mk6hqtUp33DGGtoS63tTJbMUYjRrG1Lu")
					.concat(r),
			),
		}

		const { error, data } = await createSafePromise($fetch<YouDaoResp>)(
			DICT_URL,
			{
				method: "post",
				body: new URLSearchParams(body),
				headers: {
					"User-Agent": USER_AGENT,
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				},
			},
		)

		if (error) {
			throw new Error("query failed")
		}

		if (!data) {
			throw new Error("query failed")
		}

		const { ec } = data

		if (!ec) {
			throw new Error("query failed")
		}

		const {
			word: {
				usphone: usPhonetic = "",
				ukphone: ukPhonetic = "",
				ukspeech: ukSpeech = "",
				usspeech: usSpeech = "",
				trs = [],
				wfs = [],
				prototype = "",
			},
			exam_type = [],
		} = ec

		const translations: IDictionaryTranslation[] = trs.map((item: any) => ({
			translation: item.tran,
			partName: item.pos,
		}))

		const forms: { name: string; value: string }[] = wfs.map((item: any) => {
			let value = item.wf.value
			const linkLetters = ["和", "或"]
			if (
				typeof value === "string" &&
				linkLetters.some((letter) => value.includes(letter))
			) {
				const reg = new RegExp(`[${linkLetters.join("")}]`)
				value = value.split(reg)[0]
			}
			return {
				name: item.wf.name,
				value,
			}
		})

		return {
			word,
			prototype,
			ukPhonetic,
			ukSpeech: this.getSpeechUrl(ukSpeech),
			usPhonetic,
			usSpeech: this.getSpeechUrl(usSpeech),
			translations,
			forms,
			examTypes: exam_type,
		}
	}
}
