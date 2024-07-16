import { z } from "zod"
import supabase from "~/lib/supabase"

const RefreshSchema = z.object({
	refreshToken: z.string().min(1),
})

export default defineEventHandler(async (e) => {
	const { refreshToken } = await readValidatedBody(e, RefreshSchema.parse)

	const { error, data } = await supabase.auth.refreshSession({
		refresh_token: refreshToken,
	})
	if (error) {
		throw createError(error.message)
	}

	return createBaseResponse({
		accessToken: data.session?.access_token,
		refreshToken: data.session?.refresh_token,
	})
})
