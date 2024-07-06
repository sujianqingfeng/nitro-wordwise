import type { Provider } from "@supabase/supabase-js"
import supabase from "~/lib/supabase"

export default defineEventHandler(async (e) => {
	const provider = getRouterParam(e, "provider") as Provider

	if (!provider) {
		throw createError("No provider specified")
	}

	const { redirectUrl } = getQuery(e)

	if (!redirectUrl || typeof redirectUrl !== "string") {
		throw createError("No redirect URL specified")
	}

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: redirectUrl,
		},
	})

	if (error) {
		throw createError(error.message)
	}

	return sendRedirect(e, data.url)
})
