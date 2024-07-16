import supabase from "~/lib/supabase"

const WHITE_LIST = ["/api/auth"]

export default defineEventHandler(async (e) => {
	const { pathname } = getRequestURL(e)
	if (!WHITE_LIST.some((s) => pathname.startsWith(s))) {
		const authorization = getHeader(e, "Authorization")
		if (!authorization) {
			throw createError("No authorization")
		}
		const token = authorization.split(" ")[1]
		if (!token) {
			throw createError("No authorization")
		}
		const { data, error } = await supabase.auth.getUser(token)

		if (error) {
			if (error.status === 403) {
				return createError({
					message: "Unauthorized",
					status: 401,
				})
			}

			throw createError(error.message)
		}
		e.context.user = data.user
	}
})
