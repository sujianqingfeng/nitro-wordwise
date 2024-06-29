import supabase from "~/lib/supabase"

export default defineEventHandler((e) => {
	const { code, next } = getQuery(e)
	console.log("🚀 ~ defineEventHandler ~ next:", next)
	console.log("🚀 ~ defineEventHandler ~ code:", code)
})
