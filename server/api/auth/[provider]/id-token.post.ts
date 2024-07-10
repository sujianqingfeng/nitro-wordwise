import { z } from "zod"
import supabase from "~/lib/supabase"

const RefreshSchema = z.object({
	idToken: z.string().min(1),
})

const ProviderSchema = z.object({
	provider: z.enum(["google"]),
})

export default defineEventHandler(async (e) => {
	const { provider } = await getValidatedRouterParams(e, ProviderSchema.parse)
	const { idToken } = await readValidatedBody(e, RefreshSchema.parse)

	const { data, error } = await supabase.auth.signInWithIdToken({
		provider,
		token: idToken,
	})

	if (error) {
		throw createError(error.message)
	}

	return createBaseResponse({
		accessToken: data.session?.access_token,
		refreshToken: data.session?.refresh_token,
	})
})
