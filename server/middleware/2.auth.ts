import supabase from "~/lib/supabase"

const WHITE_LIST = ["/api/auth"]

export default defineEventHandler(async (e) => {
	const { pathname } = getRequestURL(e)
	if (!WHITE_LIST.some((s) => pathname.startsWith(s))) {
		const authorization = getHeader(e, "Authorization")
		if (!authorization) {
			throw createError("No authorization header")
		}
		const token = authorization.split(" ")[1]
		if (!token) {
			throw createError("No token provided")
		}
		const { data, error } = await supabase.auth.getUser(token)
		if (error) {
			throw createError(error.message)
		}
		e.context.user = data.user
	}
})
