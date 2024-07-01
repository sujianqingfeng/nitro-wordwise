import type { Provider } from "@supabase/supabase-js"
import supabase from "~/lib/supabase"
import { createBaseResponse } from "~/utils/response"

export default defineEventHandler(async (e) => {
	const provider = getRouterParam(e, "provider") as Provider

	if (!provider) {
		throw createError("No provider specified")
	}

	const { redirectTo } = getQuery(e)

	if (!redirectTo || typeof redirectTo !== "string") {
		throw createError("No redirect URL specified")
	}

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo,
		},
	})

	if (error) {
		throw createError(error.message)
	}

	return createBaseResponse(data.url)
})
